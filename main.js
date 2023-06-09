function myFunction() {
  let mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1'); //実行したいシート名を入れる
  const val = mySheet.getRange("F:F").getValues(); //URLが入ってる行を指定
  const numberOfValues = val.filter(String).length-1; //URLが入ってる数を取得
  const url_list = mySheet.getRange(2,6,numberOfValues).getValues(); //URLが入ってる行と長さを指定

  console.log(url_list);

  let price_array = new Array();
  let name_array = new Array();
  for(i=0; i<numberOfValues; i++){
    let response = UrlFetchApp.fetch(url_list[i]);
    let text = response.getContentText("shift-jis");
    const _name_akizuki = Parser.data(text).from('<div class="order_g">') .to("<A").build(); //name
    const _price_topics = Parser.data(text).from('<div class="order_g">') .to("</div>").build();
    const _price = Parser.data(_price_topics).from('<span class="f14b">').to('</span>').iterate();//price
    let _name = escapestring(_name_akizuki);
    _name = convertCharacters(_name);
    mySheet.getRange(i+2,1).setValue(_name); // 1行目に品名を出力
    mySheet.getRange(i+2,4).setValue(_price[1]); // 4行目に価格を出力
    price_array[i] = _name;
    name_array[i] = _price;

    console.log(_name, _price);
    // Utilities.sleep(100);//500ms wait
  }

  console.log(price_array);
  console.log(name_array);
}

function convertCharacters(original) {
  let converted = ""; // 空の変数
  const pattern = /[Ａ-Ｚａ-ｚ０-９（）；：＃＝＋！？＿]/; // 全角英数のパターンを用意
  for (let i = 0; i < original.length; i++) { // 受け取った文字列の数だけ繰り返し
    if (pattern.test(original[i])) { // 文字が全角英数のとき
      const half = String.fromCharCode(original[i].charCodeAt(0) - 65248); // 半角英数に変換
      converted += half;
    } else {
      converted += original[i];
    }
  }
  converted = converted.replace(/　/g, ' ').replace(/．/g, '.'); // gオプションで該当文字列をすべて置換
  // Logger.log(converted);
  return converted;
}

function escapestring(str){
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x60/g, "`")
    .replace(/&#215;/g, "×");

}