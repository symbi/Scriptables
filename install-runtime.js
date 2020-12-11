const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
await Promise.all(['「小件件」开发环境.js', 'test.js'].map(async js => {
  //const REQ = new Request(`https://gitee.com/im3x/Scriptables/raw/v2-dev/Scripts/${encodeURIComponent(js)}`);
  const REQ = new Request(`https://github.com/symbi/Scriptables/raw/v2-dev/Scripts/${encodeURIComponent(js)}`);
  const RES = await REQ.load();
  FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), js), RES);
}));
FILE_MGR.remove(module.filename);
Safari.open("scriptable:///open?scriptName="+encodeURIComponent('test'));