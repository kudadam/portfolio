import { visit } from "unist-util-visit";
import { makeTitleBar, makeHeader, makeDirectoryHeader } from "./utils.js";
import parser from "md-attr-parser";

const plugin = () => (tree)=>{
    visit(tree, 'code',(node,index,parent) => {

        const { filename, filepath } = (parser(node.meta ?? "")).prop;
        const lang = node.lang;

        const titleBar = makeTitleBar(lang);
        const header = makeHeader(filename);
        const directoryHeader = makeDirectoryHeader(filepath)
        const mainWrapper = {
            type: 'div',
            data: { hProperties: { class: 'code-block-wrapper' } },
            children: []
          };

          if (lang) mainWrapper.children.push(titleBar);
          mainWrapper.children.push(header);
          if (filepath) mainWrapper.children.push(directoryHeader);
          mainWrapper.children.push(node);
         
        

          parent.children[index] = mainWrapper;
    })
}




export default plugin;
