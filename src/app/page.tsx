import Image from "next/image";
import Top from "@/components/Top";
import Intro from "@/components/Intro";
import Location from "@/components/Location";
import Speakers from "@/components/Speakers";
import Brief from "@/components/Brief";

export default function Home() {
  return (
    <>
      <Top />
      <Intro />
      <Location />
      <Speakers />
      <Brief />
    </>
  );
}
