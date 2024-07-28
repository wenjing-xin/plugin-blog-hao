;
(function (){
    const executeTextIndent = function (node, excludeEleObj, isOnlyPost){

        const allPostEle = document.querySelectorAll(node.postNodeName + " p:not(li>p):not(blockquote>p");
        let allPageEle = []
        if(!Boolean(isOnlyPost)){
            allPageEle = document.querySelectorAll(node.pageNodeName + " p:not(li>p):not(blockquote>p");
        }
        let excludeEleList = [];
        if(excludeEleObj && excludeEleObj.length){
            let resolveExcludeNodeList = excludeEleObj.substring(1, excludeEleObj.length -1).split(",").map(item=> item.toString().trim());
            excludeEleList.push(...resolveExcludeNodeList);
        }
        allPostEle.forEach(item => {
            excludeEleList.forEach(excludeItem => {
                if (item.innerHTML.toString().indexOf(excludeItem) == -1) {
                    item.style.textIndent = '2em';
                }else{
                    item.style.textIndent = '0em';
                }
            });
        });
        allPageEle.forEach(item => {
            excludeEleList.forEach(excludeItem => {
                if (item.innerHTML.toString().indexOf(excludeItem) == -1) {
                    item.style.textIndent = '2em';
                }else{
                    item.style.textIndent = '0em';
                }
            });
        });
    }
    window.executeTextIndent = executeTextIndent;
})();