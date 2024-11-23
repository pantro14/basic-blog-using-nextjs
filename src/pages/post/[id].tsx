import { NextPage } from "next";
import { useRouter } from "next/router";

interface Props {}

const MyOtherCoolPage: NextPage<Props> = () => {
  const router = useRouter();
  console.log(router);
  return <div>MyOtherCoolPage</div>;
};

export default MyOtherCoolPage;
