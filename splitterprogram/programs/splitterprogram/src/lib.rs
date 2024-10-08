use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

declare_id!("EbSG8YorD2N1QHoiayDba3cuDQsyUJ7ysocjHVaLb9b5");

#[program]
pub mod splitterprogram {

    use super::*;
    /// Create a vault
    pub fn initialize(
        ctx: Context<CreateVault>, // Function context containing accounts and other information
        name: String,              // Name of the vault
        percentages: Vec<u64>,     // Vector containing percentage values
        acct: Vec<Pubkey>,
        // Vector containing account public keys
    ) -> Result<()> {
        let mut total_rate = 0; // Variable to calculate the total rate

        // Calculate the total rate by summing up all the percentage values
        for item in percentages.iter() {
            total_rate += item;
        }

        // Check if the total rate is equal to 100
        if total_rate != 100 {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Check if the number of percentage values matches the number of account public keys
        if percentages.len() != acct.len() {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Display a message indicating that a vault has been created
        msg!("Congratulations! You just created a vault.");

        let vault = &mut ctx.accounts.vault; // Get a mutable reference to the vault account

        // Set the vault authority to the account key provided in the function context
        vault.authority = *ctx.accounts.authority.to_account_info().key;

        vault.total = 0; // Set the vault total to 0
        vault.name = name; // Set the vault name
        vault.percentages = percentages; // Set the vault percentage values
        vault.accounts = acct; // Set the vault account public keys
        vault.vault_bump = ctx.bumps.vault;
        vault.vault_token_account = ctx.accounts.vault_token_account.key();
        vault.token_id = ctx.accounts.token.key();

        // Iterate over the vault accounts and corresponding percentages, displaying them
        for (i, item) in vault.accounts.iter().enumerate() {
            msg!(
                "Participating address {} - and percentage {}%",
                item,
                vault.percentages[i]
            );
        }

        Ok(()) // Return Ok indicating successful execution of the function
    }

    /// Update the vault's percentage values
    #[access_control(UpdateVault::accounts(&ctx))]
    pub fn update(
        ctx: Context<UpdateVault>, // Function context containing accounts and other information
        percentages: Vec<u64>,     // Vector containing updated percentage values
    ) -> Result<()> {
        let mut total_rate = 0; // Variable to calculate the total rate

        // Calculate the total rate by summing up all the updated percentage values
        for item in percentages.iter() {
            total_rate += item;
        }

        // Check if the total rate is equal to 100
        if total_rate != 100 {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Check if the number of accounts in the vault is equal to the number of updated percentage values
        if ctx.accounts.vault.accounts.len() != percentages.len() {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Display a message indicating that the vault has been updated successfully
        msg!("Update vault successfully.");

        let vault = &mut ctx.accounts.vault; // Get a mutable reference to the vault account

        vault.percentages = percentages; // Update the vault's percentage values

        Ok(()) // Return Ok indicating successful execution of the function
    }

    /// Delete the vault and return the remaining money to the authority
    #[access_control(UpdateVault::accounts(&ctx))]
    pub fn delete(ctx: Context<UpdateVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault; // Get a mutable reference to the vault account

        // Close the vault using the authority account provided in the function context
        vault.close(ctx.accounts.authority.to_account_info())?;

        // Display a message indicating that the vault has been deleted successfully
        msg!("Vault deleted successfully.");

        Ok(()) // Return Ok indicating successful execution of the function
    }

    // deposite money to piggy
    pub fn deposite(ctx: Context<Deposite>, lamports: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault; // Get a mutable reference to the vault account

        vault.total += lamports; // Add the deposited lamports to the vault's total

        let mut vec: Vec<u64> = vec![0; vault.accounts.len()]; // Create a vector to store updated values
        let mut vec2: Vec<u64> = vec![0; vault.accounts.len()]; // Create a vector to store intermediate values

        // Iterate over the vault's account vaults and store them in vec2
        for (i, vaulter) in vault.accounts_vault.iter().enumerate() {
            vec2[i] = *vaulter;
        }

        // Calculate the money to distribute to each account based on the percentages
        for (i, percentage) in vault.percentages.iter().enumerate() {
            let money = percentage * lamports as u64 / 100;
            vec[i] = vec2[i] + money;
            msg!("Money for {}: {}", i, vec[i]);
        }

        vault.accounts_vault = vec; // Update the vault's account vaults with the calculated values

        // Create a CPI context to transfer the deposited lamports from the authority account to the vault account
        let to = ctx.accounts.vault_token_account.to_account_info(); // to
        let from = ctx.accounts.singer_token_account.to_account_info(); // from
        let accounts = Transfer {
            from: from,
            to: to,
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
        let _ = transfer(cpi_context, lamports);
        // Display a message indicating that the deposit was successful and the updated total
        msg!("Deposit successfully. Total: {}", vault.total);
        Ok(()) // Return Ok indicating successful execution of the function
    }

    // claim money from piggy to vault accounts
    #[access_control(ClaimVault::accounts(&ctx))]
    pub fn claim(ctx: Context<ClaimVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault; // Get a mutable reference to the vault account
        let vault_balance = vault.total; // Get the current balance of the vault
        let binding = vault.name.clone();
        let name = binding.as_str();
        // Check if the vault balance is 0
        if vault_balance == 0 {
            return Err(ErrorCode::Unauthorized.into());
        }

        for (i, address) in vault.accounts.iter().enumerate() {
            // Check if the claimer's address matches an address in the vault's accounts
            if address == ctx.accounts.claimer.to_account_info().key {
                let money = vault.accounts_vault[i]; // Get the money associated with the claimer's address

                if money == 0 {
                    return Err(ErrorCode::Unauthorized.into());
                } else {
                    // Update the lamports balance of the vault and claimer accounts

                    let from = ctx.accounts.vault_token_account.to_account_info();
                    let to = ctx.accounts.singer_token_account.to_account_info();
                    let accounts = Transfer {
                        from: from,
                        to: to,
                        authority: vault.to_account_info(),
                    };
                    let seeds = &[
                        &b"vault"[..],
                        &name_seed(name),
                        &ctx.accounts.claimer.key().to_bytes(),
                        &ctx.accounts.token.key().to_bytes(),
                        &[vault.vault_bump],
                    ];
                    let singer_seed = &[&seeds[..]];
                    let paralel_execution = CpiContext::new_with_signer(
                        ctx.accounts.token_program.to_account_info(),
                        accounts,
                        singer_seed,
                    );

                    vault.total = vault.total - money; // Deduct the claimed money from the vault's total
                    vault.accounts_vault[i] = 0; // Set the claimed money for the account to 0
                    let _ = transfer(paralel_execution, vault_balance);
                    msg!("Claim successfully. Total: {}", vault.total);
                }

                return Ok(()); // Return Ok indicating successful execution of the function
            }
        }

        Ok(()) // Return Ok indicating successful execution of the function
    }
}


#[derive(Accounts)]
#[instruction(name: String,percentage: Vec<u64>)]
pub struct CreateVault<'info> {
    #[account(
        init,
        payer=authority,
        space = 8 + CreateVault::space(&name,percentage),
        seeds=[
            b"vault",
            name_seed(&name),
            authority.to_account_info().key.as_ref(),
            token.key().as_ref(),
        ],
        bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub authority: Signer<'info>, // 8B4vVJeMJkPKGFj88f9GMkiBpNx5yqCPGGuCWP5Wmhjq

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint= token,
        associated_token::authority = vault
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub token: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct UpdateVault<'info> {
    #[account(mut, has_one=authority @ ErrorCode::WrongOwner)]
    pub vault: Account<'info, Vault>,
    /// The authority signing the transaction.

    #[account(mut)]
    pub authority: Signer<'info>,
    /// The system program account.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposite<'info> {
    /// PDA account to deposit to.
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    /// The authority signing the transaction.
    #[account(mut)]
    pub authority: Signer<'info>,
    /// The system program account.
    pub system_program: Program<'info, System>,

    pub token: Account<'info, Mint>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub singer_token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct ClaimVault<'info> {
    /// PDA account to claim to.
    #[account(mut)]
    pub vault: Account<'info, Vault>,

    /// The authority signing the transaction. these time its different from the authority of the vault.
    #[account(mut)]
    pub claimer: Signer<'info>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = claimer,
        associated_token::mint= token,
        associated_token::authority = claimer
    )]
    pub singer_token_account: Account<'info, TokenAccount>,
    pub token: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    /// The system program account.
    pub system_program: Program<'info, System>,
}

/// Represents a vault account.
#[account]
pub struct Vault {
    /// The name of the vault.
    pub name: String,

    /// The public key of the authority controlling the vault.
    pub authority: Pubkey,

    /// The total balance of the vault.
    pub total: u64,

    /// The percentages associated with each account in the vault.
    pub percentages: Vec<u64>,

    /// The balances of each account in the vault.
    pub accounts_vault: Vec<u64>,

    /// The account public keys associated with the vault.
    pub accounts: Vec<Pubkey>,

    // token to be transferred
    pub token_id: Pubkey,

    // vault's token account ATA
    pub vault_token_account: Pubkey,

    pub vault_bump: u8,
}

impl CreateVault<'_> {
    /// Calculates the required account space for creating a vault.
    ///
    /// # Arguments
    ///
    /// * `name`: The name of the vault.
    /// * `acct`: The percentages associated with each account in the vault.
    ///
    /// # Returns
    ///
    /// The total account space required for the vault.
    ///
    fn space(name: &str, acct: Vec<u64>) -> usize {
        let name_len = name.len() as usize;
        let accounts_len = acct.len();
        let name_size = 4 + name_len;
        let authority_size = 32; // Assuming the authority field is always a Pubkey (32 bytes)
        let total_size = 8;
        let percentages_size = 4 + (8 * (1 + accounts_len));
        let accounts_vault_size = 4 + (8 * (1 + accounts_len));
        let accounts_size = 4 + (32 * (1 + accounts_len));
        let token_id_size = 32;
        let vault_token_account = 4 + 32;
        name_size
            + authority_size
            + total_size
            + percentages_size
            + accounts_vault_size
            + accounts_size
            + token_id_size
            + vault_token_account
            + 8
            + 1
    }
}

impl UpdateVault<'_> {
    pub fn accounts(ctx: &Context<UpdateVault>) -> Result<()> {
        // Check if the authority key in the context matches the authority key in the vault
        if ctx.accounts.authority.key != &ctx.accounts.vault.authority {
            return Err(ErrorCode::Unauthorized.into());
        }
        Ok(()) // Return Ok indicating successful execution of the function
    }
}
impl ClaimVault<'_> {
    pub fn accounts(ctx: &Context<ClaimVault>) -> Result<()> {
        let vault = &ctx.accounts.vault;

        // Check if the claimer's key is present in the vault's accounts
        if !vault.accounts.contains(&ctx.accounts.claimer.key) {
            return Err(ErrorCode::Unauthorized.into());
        }

        Ok(()) // Return Ok indicating successful execution of the function
    }
}
fn name_seed(name: &str) -> &[u8] {
    let b = name.as_bytes(); // Convert the input string `name` to a byte slice `b`
    if b.len() > 32 {
        &b[0..32] // If the length of `b` is greater than 32, return the first 32 bytes
    } else {
        b // Otherwise, return `b` as is
    }
}

// Error handling
#[error_code]
pub enum ErrorCode {
    #[msg("Sum of percentages must be 100")]
    SumPercentages,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Wrong Owner")]
    WrongOwner,
}