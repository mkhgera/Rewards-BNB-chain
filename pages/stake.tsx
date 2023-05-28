import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import TripleToggleSwitch from "./Switcher";
const nftDropContractAddress = "0xFeF73CcFB94D033ff1A663B40431941834694e04";
const tokenContractAddress = "0x0bD8a49b17AF25A8031AC7ac825240DC391E24FC";
const stakingContractAddress = "0x4486801EbC1BC920291282a63faDAB0BFf7b30cd";
const Stake: NextPage = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Contract Hooks
  const nftDropContract = useContract(
    nftDropContractAddress,
    "nft-drop"
  ).contract;
  const tokenContract = useContract(tokenContractAddress, "token").contract;
  const { contract, isLoading } = useContract(stakingContractAddress);

  // Load Unstaked NFTs
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

  // Load Balance of Token
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  ///////////////////////////////////////////////////////////////////////////
  // Custom contract functions
  ///////////////////////////////////////////////////////////////////////////
  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    if (!contract) return;

    async function loadStakedNfts() {
      const stakedTokens = await contract?.call("getStakedTokens", address);

      // For each staked token, fetch it from the sdk
      const stakedNfts = await Promise.all(
        stakedTokens?.map(
          async (stakedToken: { staker: string; tokenId: BigNumber }) => {
            const nft = await nftDropContract?.get(stakedToken.tokenId);
            return nft;
          }
        )
      );

      setStakedNfts(stakedNfts);
      console.log("setStakedNfts", stakedNfts);
    }

    if (address) {
      loadStakedNfts();
    }
  }, [address, contract, nftDropContract]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const cr = await contract?.call("availableRewards", address);
      console.log("Loaded claimable rewards", cr);
      setClaimableRewards(cr);
    }

    loadClaimableRewards();
  }, [address, contract]);

  ///////////////////////////////////////////////////////////////////////////
  // Write Functions
  ///////////////////////////////////////////////////////////////////////////
  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    // If not approved, request approval
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    const stake = await contract?.call("stake", id);
  }

  async function withdraw(id: BigNumber) {
    const withdraw = await contract?.call("withdraw", id);
  }

  async function claimRewards() {
    const claim = await contract?.call("claimRewards");
  }

  const buttons = [
    { value: "left", label: "Your Tokens" },
    { value: "center", label: "Staked NFTs" },
    { value: "right", label: "Unstaked NFTs" },
  ];
  const [activeButton, setActiveButton] = useState("left");
  const handleToggleChange = (value: string) => {
    setActiveButton(value);
  };
  if (isLoading) {
    return <div>Loading</div>;
  }
  const renderContent = () => {
    switch (activeButton) {
      case "left":
        return (
          <div>
            <div className={styles.tokenCardWrapper}>
              <div className={styles.tokenCard}>
                <div className={styles.cardContent}>
                  <h3>Current Balance</h3>
                  <p className="">
                    <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                  </p>
                </div>
              </div>
              <div className={styles.tokenCard}>
                <div className={styles.cardContent}>
                  <h3 className="h3">Claimable Rewards</h3>
                  <p className="">
                    <b>
                      {!claimableRewards
                        ? "Loading..."
                        : ethers.utils.formatUnits(claimableRewards, 18)}
                    </b>{" "}
                    {tokenBalance?.symbol}
                  </p>
                </div>
                <button className="btn center" onClick={() => claimRewards()}>
                  Claim Rewards
                </button>
              </div>
            </div>
          </div>
        );
      case "center":
        return (
          <div>
            <h2>Your Staked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {stakedNfts?.map((nft) => (
                <div
                  className={styles.nftBox}
                  key={nft?.metadata.id.toString()}
                >
                  <div className="cnf">
                    <ThirdwebNftMedia
                      metadata={nft?.metadata}
                      className={styles.nftMedia}
                    />
                    <h3>{nft?.metadata.name}</h3>
                    <button
                      className="btn cnf"
                      onClick={() => withdraw(nft?.metadata.id)}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "right":
        return (
          <div>
            {" "}
            <h2>Your Unstaked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft) => (
                <div
                  className={styles.nftBox}
                  key={nft?.metadata.id.toString()}
                >
                  <div className="cnf">
                    <ThirdwebNftMedia
                      metadata={nft?.metadata}
                      className={styles.nftMedia}
                    />
                    <h3>{nft?.metadata.name}</h3>
                    <button
                      className="btn cnf"
                      onClick={() => stakeNft(nft?.metadata.id)}
                    >
                      Stake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div className="wrapper">
        <div className="bg-container ellipse-left" />
        <div className="bg-container ellipse-right" />
        <h1 className="h1">
            Stake Your <span>NFT</span>s
          </h1>
        <div className="stakeContent">
          {!address ? (
            <div className="center">
              <button className="btn" onClick={connectWithMetamask}>
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              <TripleToggleSwitch
                buttons={buttons}
                onChange={handleToggleChange}
              />
              {renderContent()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Stake;
