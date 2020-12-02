import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { toast, ToastContainer } from "react-nextjs-toast";

export default function Home() {
  return (
    <React.Fragment>
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={utilStyles.headingMd}>
          <p> sait gümüş - software engineering.</p>
        </section>
      </Layout>
      <ToastContainer align={"center"} position={"bottom"} />
    </React.Fragment>
  );
}
