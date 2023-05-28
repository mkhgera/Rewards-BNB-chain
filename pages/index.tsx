import { useRouter } from "next/router";
const Home = () => {
  const router = useRouter();

  return (
    <>
	<div className="wrap">
      <div>
        <h1 className="h1">
          <span>Exeptra -</span> custom staking contract
        </h1>
        <div className="cardsWrapper">
          <div className="actionCard">
            <h2>Mint a new NFT</h2>
            <p className="parText">
              Use the NFT Drop Contract to claim an NFT from the collection.
            </p>
            <button className="btn">
              <div onClick={() => router.push(`/mint`)}>Mint NFT</div>
            </button>
          </div>

          <div className="actionCard">
            <h2>Stake your NFT</h2>
            <p className="parText">
              Use the custom staking contract deployed via thirdweb Deploy to
              stake your NFTs
            </p>
            <button className="btn">
              <div onClick={() => router.push(`/stake`)}>Stake NFT</div>
            </button>
          </div>
        </div>
      </div>
	  </div>
    </>
  );
};

export default Home;
