import { Explorer } from "@/components/WorkSpace/FileSystem/Data/folderData";

const useTraverseTree = () => {
  // Add a file or folder in tree
  // Can be optimised using Dynamic Programming
  const insertNode = function (
    tree: Explorer,
    folderId: string,
    item: string,
    isFolder: boolean
  ): Explorer {
    if (tree.id === folderId && tree.isFolder) {
      tree.items.unshift({
        id: new Date().getTime().toString(),
        name: item,
        isFolder: isFolder,
        items: [],
        responseText: "",
        key: "",
      });

      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob: Explorer) => {
      return insertNode(ob, folderId, item, isFolder);
    });

    return { ...tree, items: latestNode };
  };

  const deleteNode = () => {}; // Do it Yourself

  const renameNode = () => {}; // Do it Yourself

  return { insertNode, deleteNode, renameNode };
};

export default useTraverseTree;
