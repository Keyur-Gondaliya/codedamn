import Split from "react-split";
import TerminalView from "./Terminal/TerminalView";
import EditorView from "./EditorView/EditorView";

type Props = {};

function PlayGround({}: Props) {
  return (
    <Split direction="vertical" gutterSize={3} sizes={[80, 20]} minSize={10}>
      <EditorView />
      <TerminalView />
    </Split>
  );
}

export default PlayGround;
