# SPLİTER (Vault Management Program)

https://github.com/user-attachments/assets/9a45d668-ca90-471f-84eb-0b4e01e8b52b

## Introduction

This program is designed to manage a vault system on the Solana blockchain using SPL tokens. The vault structure allows users to deposit SPL tokens into a shared vault, and the funds are distributed to predefined accounts based on a percentage distribution. Users can also withdraw funds from the vault according to their ownership percentage. The program is developed using the Anchor framework, which simplifies Solana program development.

## Features

1. **Initialize a Vault**: Users can create a new vault by providing a name, a list of account addresses, and corresponding percentage distributions. The percentage distributions must add up to 100, ensuring a proper division of funds among the accounts.
2. **Update a Vault**: Users can update the vault by modifying the percentage distributions and associated accounts.
3. **Deposit Funds**: Funds can be deposited into the vault, and they are automatically distributed to the accounts based on the specified percentages.
4. **Claim Funds**: Users can withdraw their share of funds from the vault according to their ownership percentage.
5. **Delete Vault**: A vault can be deleted, and any remaining funds are returned to the authority of the program.

## Instructions

### Creating a Vault

To create a vault, users must specify:
- A **name** for the vault.
- A **list of percentages** corresponding to the distribution of funds for each account.
- A **list of accounts**, which must be valid Solana public keys.
  
The percentages must add up to 100, and the number of percentages must match the number of accounts. After initializing the vault, users can deposit SPL tokens into it. The deposited tokens will be divided among the accounts according to the provided percentages.

### Depositing Funds

Once a vault has been created, users can deposit SPL tokens into the vault. The tokens will be automatically distributed to the associated accounts based on their predefined percentages. The distribution occurs every time a deposit is made, ensuring a fair allocation of the deposited funds.

### Claiming Funds

Each account can withdraw funds from the vault according to its percentage ownership. The amount that can be claimed is based on the user's percentage of the total vault and the amount of funds available in the vault.

---

## Functions

### 1. **`initialize`**

The `initialize` function is used to create a new vault. It takes the following parameters:

- **ctx**: The context of the transaction, including the vault account and the authority.
- **name**: A string representing the name of the vault.
- **percentages**: A vector of integers representing the percentage distribution for each account.
- **acct**: A vector of Solana public keys representing the participating accounts.

**Logic**:
- The function checks if the total sum of percentages equals 100.
- It ensures that the number of percentages matches the number of accounts.
- Once the checks pass, the vault is initialized with the provided parameters.
- The function logs the participating addresses and their percentages for reference.

**Error Handling**:
- `SumPercentages`: Triggered if the sum of percentages does not equal 100.
- `Unauthorized`: Triggered if the user does not have the required permissions to initialize the vault.

### 2. **`update`**

The `update` function modifies the existing vault settings. It allows users to update the percentages and the associated accounts. The input parameters are:

- **ctx**: The transaction context, including the vault and authority.
- **percentages**: A vector of updated percentage distributions.
- **acct**: A vector of updated account addresses.

**Logic**:
- Similar to `initialize`, the function checks that the percentages add up to 100.
- It verifies that the number of percentages matches the number of accounts.
- If the checks pass, the vault is updated with the new settings.

**Error Handling**:
- `SumPercentages`: Triggered if the sum of percentages does not equal 100.
- `Unauthorized`: Triggered if the user is not authorized to update the vault.

### 3. **`delete`**

The `delete` function allows the vault to be deleted, transferring any remaining assets back to the authority. The parameters are:

- **ctx**: The transaction context, including the vault and the authority.


| Function   | Input Parameters                        | Accounts                                                    | Output Parameters               | Error Handling                                      |
|------------|------------------------------------------|--------------------------------------------------------------|---------------------------------|------------------------------------------------------|
| initialize | ctx: Context<CreateVault>                | vault: Account<'info, Vault>                                 | Result<(), ErrorCode>           | ErrorCode::Unauthorized                               |
|            | name: String                             | authority: Signer<'info>                                     |                                 | ErrorCode::SumPercentages                            |
|            | percentages: Vec<u64>                    | system_program: Program<'info, System>                       |                                 |                                                      |
|            | acct: Vec<Pubkey>                        | vault_token_account: Account<'info, TokenAccount>            |                                 |                                                      |
|            |                                          | token: Account<'info, Mint>                                  |                                 |                                                      |
|            |                                          | token_program: Program<'info, Token>                         |                                 |                                                      |
|            |                                          | associated_token_program: Program<'info, AssociatedToken>    |                                 |                                                      |
| update     | ctx: Context<UpdateVault>                | vault: Account<'info, Vault>                                 | Result<(), ErrorCode>           | ErrorCode::Unauthorized                               |
|            | percentages: Vec<u64>                    | authority: Signer<'info>                                     |                                 | ErrorCode::SumPercentages                            |
| delete     | ctx: Context<UpdateVault>                | vault: Account<'info, Vault>                                 | Result<(), ErrorCode>           | ErrorCode::Unauthorized                               |
|            |                                          | authority: Signer<'info>                                     |                                 |                                                      |
|            |                                          | system_program: Program<'info, System>                       |                                 |                                                      |
| deposit    | ctx: Context<Deposit>                    | vault: Account<'info, Vault>                                 | Result<(), ErrorCode>           | ErrorCode::Unauthorized                               |
|            | lamports: u64                            | authority: Signer<'info>                                     |                                 |                                                      |
|            |                                          | vault_token_account: Account<'info, TokenAccount>            |                                 |                                                      |
|            |                                          | singer_token_account: Account<'info, TokenAccount>           |                                 |                                                      |
|            |                                          | token: Account<'info, Mint>                                  |                                 |                                                      |
|            |                                          | token_program: Program<'info, Token>                         |                                 |                                                      |
|            |                                          | associated_token_program: Program<'info, AssociatedToken>    |                                 |                                                      |
| claim      | ctx: Context<ClaimVault>                 | vault: Account<'info, Vault>                                 | Result<(), ErrorCode>           | ErrorCode::Unauthorized                               |
|            | claimer: Signer<'info>                   | vault_token_account: Account<'info, TokenAccount>            |                                 |                                                      |
|            |                                          | singer_token_account: Account<'info, TokenAccount>           |                                 |                                                      |
|            |                                          | token: Account<'info, Mint>                                  |                                 |                                                      |
|            |                                          | token_program: Program<'info, Token>                         |                                 |                                                      |
|            |                                          | associated_token_program: Program<'info, AssociatedToken>    |                                 |                                                      |

**Logic**:
- The function closes the vault and transfers all assets back to the authority.
- A log message is generated to indicate the successful deletion of the vault.

### 4. **`deposite`**

The `deposite` function is used to deposit SPL tokens into the vault. The parameters are:

- **ctx**: The transaction context, including the vault and the authority.
- **lamports**: The amount of tokens to be deposited.

**Logic**:
- The deposited tokens are distributed among the accounts based on their percentages.
- The vault's balance is updated accordingly.
- A log message is generated to indicate the successful deposit.

### 5. **`claim`**

The `claim` function allows a participating account to withdraw its share of tokens from the vault. The parameters are:

- **ctx**: The transaction context, including the vault and the authority.
- **claimer**: The account attempting to claim its share.

**Logic**:
- The function verifies that the claimer is one of the participating accounts.
- It transfers the corresponding amount of tokens to the claimer's account.
- The vault's balance is updated, and a log message is generated to indicate the successful claim.

**Error Handling**:
- `Unauthorized`: Triggered if the claimer is not one of the participating accounts.

---

## Error Handling

The program can return the following errors:

- **SumPercentages**: This error occurs when the percentages provided do not add up to 100.
- **Unauthorized**: This error occurs when the user does not have permission to perform the requested operation.
- **WrongOwner**: This error occurs when a user attempts to perform an action on a vault they do not own.

---

## Future Features

The program is under active development, and future features include:

1. **Multiple Vault Support**: Users will be able to create and manage multiple vaults simultaneously.
2. **Vault-to-Vault Transfers**: The ability to transfer assets between vaults.
3. **Dynamic Account Management**: The ability to add or remove accounts from a vault after its creation.


for contact izal.mert@gmail.com - https://x.com/SplitterWeb3
