import Navbar from "@/components/Navbar/Navbar";
import WorkSpace from "@/components/WorkSpace/WorkSpace";

type Props = {};

function Playground({}: Props) {
  return (
    <div className="bg-dark-layer-1 h-screen">
      <Navbar />
      <WorkSpace />
    </div>
  );
}

export default Playground;
