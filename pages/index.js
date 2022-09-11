import Head from "next/head";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
//import ManualHeader from "../components/ManualHeader";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
      
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract LOTTERY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header></Header>
        <LotteryEntrance></LotteryEntrance>
      </main>
    </div>
  );
}
