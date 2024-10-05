export type SplitterWallet = {
  "version": "0.1.0",
  "name": "spliter",
  "instructions": [
      {
          "name": "initialize",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "name",
                  "type": "string"
              },
              {
                  "name": "percentages",
                  "type": {
                      "vec": "u64"
                  }
              },
              {
                  "name": "acct",
                  "type": {
                      "vec": "publicKey"
                  }
              }
          ]
      },
      {
          "name": "update",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "percentages",
                  "type": {
                      "vec": "u64"
                  }
              }
          ]
      },
      {
          "name": "delete",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": []
      },
      {
          "name": "deposite",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "singerTokenAccount",
                  "isMut": true,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "lamports",
                  "type": "u64"
              }
          ]
      },
      {
          "name": "claim",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "claimer",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "singerTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": []
      }
  ],
  "accounts": [
      {
          "name": "Vault",
          "type": {
              "kind": "struct",
              "fields": [
                  {
                      "name": "name",
                      "type": "string"
                  },
                  {
                      "name": "authority",
                      "type": "publicKey"
                  },
                  {
                      "name": "total",
                      "type": "u64"
                  },
                  {
                      "name": "percentages",
                      "type": {
                          "vec": "u64"
                      }
                  },
                  {
                      "name": "accountsVault",
                      "type": {
                          "vec": "u64"
                      }
                  },
                  {
                      "name": "accounts",
                      "type": {
                          "vec": "publicKey"
                      }
                  },
                  {
                      "name": "tokenId",
                      "type": "publicKey"
                  },
                  {
                      "name": "vaultTokenAccount",
                      "type": "publicKey"
                  },
                  {
                      "name": "vaultBump",
                      "type": "u8"
                  }
              ]
          }
      }
  ],
  "errors": [
      {
          "code": 6000,
          "name": "SumPercentages",
          "msg": "Sum of percentages must be 100"
      },
      {
          "code": 6001,
          "name": "Unauthorized",
          "msg": "Unauthorized"
      },
      {
          "code": 6002,
          "name": "WrongOwner",
          "msg": "Wrong Owner"
      }
  ]
}

export const IDL: SplitterWallet = {
  "version": "0.1.0",
  "name": "spliter",
  "instructions": [
      {
          "name": "initialize",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "name",
                  "type": "string"
              },
              {
                  "name": "percentages",
                  "type": {
                      "vec": "u64"
                  }
              },
              {
                  "name": "acct",
                  "type": {
                      "vec": "publicKey"
                  }
              }
          ]
      },
      {
          "name": "update",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "percentages",
                  "type": {
                      "vec": "u64"
                  }
              }
          ]
      },
      {
          "name": "delete",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": []
      },
      {
          "name": "deposite",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "singerTokenAccount",
                  "isMut": true,
                  "isSigner": false
              }
          ],
          "args": [
              {
                  "name": "lamports",
                  "type": "u64"
              }
          ]
      },
      {
          "name": "claim",
          "accounts": [
              {
                  "name": "vault",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "authority",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "claimer",
                  "isMut": true,
                  "isSigner": true
              },
              {
                  "name": "vaultTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "singerTokenAccount",
                  "isMut": true,
                  "isSigner": false
              },
              {
                  "name": "token",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "associatedTokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "tokenProgram",
                  "isMut": false,
                  "isSigner": false
              },
              {
                  "name": "systemProgram",
                  "isMut": false,
                  "isSigner": false
              }
          ],
          "args": []
      }
  ],
  "accounts": [
      {
          "name": "Vault",
          "type": {
              "kind": "struct",
              "fields": [
                  {
                      "name": "name",
                      "type": "string"
                  },
                  {
                      "name": "authority",
                      "type": "publicKey"
                  },
                  {
                      "name": "total",
                      "type": "u64"
                  },
                  {
                      "name": "percentages",
                      "type": {
                          "vec": "u64"
                      }
                  },
                  {
                      "name": "accountsVault",
                      "type": {
                          "vec": "u64"
                      }
                  },
                  {
                      "name": "accounts",
                      "type": {
                          "vec": "publicKey"
                      }
                  },
                  {
                      "name": "tokenId",
                      "type": "publicKey"
                  },
                  {
                      "name": "vaultTokenAccount",
                      "type": "publicKey"
                  },
                  {
                      "name": "vaultBump",
                      "type": "u8"
                  }
              ]
          }
      }
  ],
  "errors": [
      {
          "code": 6000,
          "name": "SumPercentages",
          "msg": "Sum of percentages must be 100"
      },
      {
          "code": 6001,
          "name": "Unauthorized",
          "msg": "Unauthorized"
      },
      {
          "code": 6002,
          "name": "WrongOwner",
          "msg": "Wrong Owner"
      }
  ]
}