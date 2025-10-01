/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "LIBRARY_SLUG_GENERATOR_DEV2",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Slug Generator Library DEV",
  "description" : "Library to generate the slug",
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function slugify(string, options) {
  if (typeof string !== 'string') {
    throw new Error('slugify: string argument expected');
  }

  options = (typeof options === 'string')
    ? { replacement: options }
    : options || {};


  const charMap = {"$":" dollar ",".":"-","%":" percent ","&":" and ","<":"less",">":"greater","|":" or ","¢":"cent","£":"pound","¤":"currency","¥":"yen","_":"-","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la","\\": "","/":""};
 // const charMap = {"$":" dollar ",".":"-","%":" percent ","<":"less",">":"greater","|":" or ","¢":"cent","£":"pound","¤":"currency","¥":"yen","_":"-","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"};
  //const charMap = {"<":"less",">":"greater","¢":"cent","£":"pound","¤":"currency","¥":"yen","_":"-","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ō":"O","ō":"o","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","Ə":"E","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","ə":"e","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","Ա":"A","Բ":"B","Գ":"G","Դ":"D","Ե":"E","Զ":"Z","Է":"E\'","Ը":"Y\'","Թ":"T\'","Ժ":"JH","Ի":"I","Լ":"L","Խ":"X","Ծ":"C\'","Կ":"K","Հ":"H","Ձ":"D\'","Ղ":"GH","Ճ":"TW","Մ":"M","Յ":"Y","Ն":"N","Շ":"SH","Չ":"CH","Պ":"P","Ջ":"J","Ռ":"R\'","Ս":"S","Վ":"V","Տ":"T","Ր":"R","Ց":"C","Փ":"P\'","Ք":"Q\'","Օ":"O\'\'","Ֆ":"F","և":"EV","ء":"a","آ":"aa","أ":"a","ؤ":"u","إ":"i","ئ":"e","ا":"a","ب":"b","ة":"h","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ى":"a","ي":"y","ً":"an","ٌ":"on","ٍ":"en","َ":"a","ُ":"u","ِ":"e","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","پ":"p","چ":"ch","ژ":"zh","ک":"k","گ":"g","ی":"y","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ṣ":"S","ṣ":"s","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","–":"-","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","„":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₺":"turkish lira","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial","ﻵ":"laa","ﻷ":"laa","ﻹ":"lai","ﻻ":"la"};

 /* const charMap = {
    "$": "dollar",
    "%": "percent",
    "&": "and",
    "<": "less",
    ">": "greater",
    "|": "or",
    "¢": "cent",
    "£": "pound",
    "¤": "currency",
    "¥": "yen",
    "©": "(c)",
    "ª": "a",
    "®": "(r)",
    "º": "o",
    "À": "A",
    "Á": "A"
 
  };*/

 /* const locales = {
    bg: { "Й": "Y", "Ц": "Ts", "Щ": "Sht", "Ъ": "A", "Ь": "Y", "й": "y", "ц": "ts", "щ": "sht", "ъ": "a", "ь": "y" },
    de: { "Ä": "AE", "ä": "ae", "Ö": "OE", "ö": "oe", "Ü": "UE", "ü": "ue", "ß": "ss", "%": "prozent", "&": "und", "|": "oder", "∑": "summe", "∞": "unendlich", "♥": "liebe" },
    // ... (complete locales from the original code)
  };*/
  const locales ={"bg":{"Й":"Y","Ц":"Ts","Щ":"Sht","Ъ":"A","Ь":"Y","й":"y","ц":"ts","щ":"sht","ъ":"a","ь":"y"},"de":{"Ä":"AE","ä":"ae","Ö":"OE","ö":"oe","Ü":"UE","ü":"ue","ß":"ss","%":"prozent","&":"und","|":"oder","∑":"summe","∞":"unendlich","♥":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","¢":"centavos","£":"libras","¤":"moneda","₣":"francos","∑":"suma","∞":"infinito","♥":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","¢":"centime","£":"livre","¤":"devise","₣":"franc","∑":"somme","∞":"infini","♥":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","¢":"centavo","∑":"soma","£":"libra","∞":"infinito","♥":"amor"},"uk":{"И":"Y","и":"y","Й":"Y","й":"y","Ц":"Ts","ц":"ts","Х":"Kh","х":"kh","Щ":"Shch","щ":"shch","Г":"H","г":"h"},"vi":{"Đ":"D","đ":"d"},"da":{"Ø":"OE","ø":"oe","Å":"AA","å":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"større end"},"nb":{"&":"og","Å":"AA","Æ":"AE","Ø":"OE","å":"aa","æ":"ae","ø":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","Å":"AA","Ä":"AE","Ö":"OE","å":"aa","ä":"ae","ö":"oe"}};

  const locale = locales[options.locale] || {};
  const replacement = options.replacement === undefined ? '-' : options.replacement;
  const trim = options.trim === undefined ? true : options.trim;


//this is for removing all the characters after the pipe symbol  
  const lastPipeIndex = string.lastIndexOf('|');
  log.info(lastPipeIndex + "last piper Index");
  if (lastPipeIndex !== -1) {
    string = string.substring(0, lastPipeIndex);
  } 

  var slug = string.normalize().split('')
    .reduce(function (result, ch) {
      var appendChar = locale[ch];
      if (appendChar === undefined) appendChar = charMap[ch];
      if (appendChar === undefined) appendChar = ch;
      if (appendChar === replacement) appendChar = ' ';
   //   return result + appendChar.replace(options.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '');
       // return result + appendChar.replace(options.remove || /[,\;:"*+_=']+/g, '');
         return result + appendChar.replace(options.remove || /[,\;:"*+_='!#❤×©®.?@()\/[\]]+/g, '');
      //  return result + appendChar.replace(options.remove || /[^\w\s$*_+~.()'"!\-:@,;:"'&=]+/g, '');
    }, '');



 /* const wordsToRemove = ['and', 'or', 'percent', 'dollar', 'the'];
  wordsToRemove.forEach(word => {
    slug = slug.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  });*/




  
  
  if (options.strict) {
    slug = slug.replace(/[^A-Za-z0-9\s.?@()\/[\]]/g, '');
  }

  if (trim) {
    slug = slug.trim();
  }

  slug = slug.replace(/\s+/g, replacement);

  if (options.lower) {
    slug = slug.toLowerCase();
  }

slug = slug.toLowerCase();
 slug = convertString(slug);
 slug = removeWords(slug);
 var lastchar = slug.slice(-1);
 if(lastchar == "-"){
 	slug = slug.replace("-","");
 }
  return slug;
}

slugify.extend = function (customMap) {
  Object.assign(charMap, customMap);
};

//This as been removed as part of the PDM Suggestion
/*function convertString(input) {
    if (typeof input !== 'string') {
      throw new Error('convertString: string argument expected');
    }
  
    return input.replace(/-and-/g, '-').replace(/-or-/g, '-').replace(/-percent-/g, '-').replace(/-dollar-/g, '-').replace(/-the-/g, '-').replace(/-to-/g, '-')
                .replace(/-\band\b(?!-)/g, '').replace(/-\bor\b(?!-)/g, '').replace(/-\bpercent\b(?!-)/g, '')
                .replace(/-\bdollar\b(?!-)/g, '').replace(/-\bthe\b(?!-)/g, '').replace(/-\bto\b(?!-)/g, '')
                .replace(/\band\b-/g, '').replace(/\bor\b-/g, '').replace(/\bpercent\b-/g, '')
                .replace(/\bdollar\b-/g, '').replace(/\bthe\b-/g, '').replace(/\bto\b-/g, '');
  }*/

function convertString(input) {
 
    // Handle both null and undefined
    if (input == null) { 
	   throw new Error('null/undefined input');
    }
    if (typeof input !== 'string') {
        throw new Error('convertString: string argument expected');
    }
    // return for empty string
    if (input.length === 0) {
    	   return input;	
    }
 
    // Remove leading and trailing $ symbols
    input = input.replace(/^\$+|\$+$/g, '');
    
    // Replace multiple $ between letters with a single '-'
    input = input.replace(/\$+/g, '-');
 
    input = input.replace(/-or-/g, '-')
		        .replace(/-percent-/g, '-')
		        .replace(/-dollar-/g, '-')
		        .replace(/-the-/g, '-')
		        .replace(/-\bor\b(?!-)/g, '')
		        .replace(/-\bpercent\b(?!-)/g, '')
		        .replace(/-\bdollar\b(?!-)/g, '')
		        .replace(/-\bthe\b(?!-)/g, '')
		        .replace(/\bor\b-/g, '')
		        .replace(/\bpercent\b-/g, '')
		        .replace(/\bdollar\b-/g, '')
		        .replace(/\bthe\b-/g, '');
    
    return input;
}

function removeWords(streamOfWords){
//This as been removed as part of the PDM Suggestion
 //const wordsToRemove = ['and', 'or', 'percent', 'dollar', 'the'];	
  const wordsToRemove = ['or', 'percent', 'dollar', 'the'];	
  wordsToRemove.forEach(word => {
    streamOfWords = streamOfWords.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  //  streamOfWords = streamOfWords.replace(new RegExp(`(\\W|^)${word}(\\W|$)`, 'gi'), '$1$2');
  });
	return streamOfWords;
}


function SEOcheckcondition(step, LookupTableHome, node) {
    var count = 0;
    var userId = step.getCurrentUser();
    var userGroups = userId.getAllGroups().toArray();
    for (var i in userGroups) {
        var BrandValue = userGroups[i].getValue("a_Brand_Number").getSimpleValue();
      //  if ((BrandValue != null && userGroups[i].getName() != "GPS-PIM-Lead-MC-Security-Group-NonProd") || (BrandValue != null && userGroups[i].getName() != "GPS-PIM-Lead-MC-Security-Group") ) {
        if (BrandValue != null) {
            var BrandValueArray = BrandValue.split(";")
            var AllowedBrands = LookupTableHome.getLookupTableValue("LKT_SEOConfigManagementbyBrand", "AllowedBrand");
            var nodeBrand = node.getValue("a_Brand_Number").getSimpleValue();
            if (nodeBrand != null && AllowedBrands != null) { // handling null cases
                var AllowedBrandsArray = AllowedBrands.split(";");
                if (AllowedBrandsArray.includes(nodeBrand) && BrandValueArray.includes(nodeBrand)) {
                    // Access granted
                    count = 1;
                }
            }
        }
        var UserGroupID = userGroups[i].getID();
        if (UserGroupID == "Stibo" || UserGroupID == "Super user") {
            count = count + 1
        }
    }
    if (count > 0) {
        return true;
    } else {
        return false;
    }
}



function copyAttributesFromOneContextToAnother(node, step, attrGroup, fromContext, toContext) {
    step.executeInContext(fromContext, function(frContextManager) {
        var frNode = frContextManager.getClassificationHome().getClassificationByID(node.getID());
        for (var i in attrGroup) {
            var frAttributeValue = frNode.getValue(attrGroup[i]).getSimpleValue();
            if (frAttributeValue != null) {
                step.executeInContext(toContext, function(toContextManager) {
                    var toNode = toContextManager.getClassificationHome().getClassificationByID(frNode.getID());
                    toNode.getValue(attrGroup[i]).setSimpleValue(frAttributeValue);
                });
            }
        }
    });
}


function generatePageDescription(step,node) {
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var SEOPageTitle = node.getValue("a_SEO_Page_Title").getSimpleValue();
    log.info(SEOPageTitle);
    var Context = step.getCurrentContext().getID();

    if (SEOPageTitle != null) {

        if (brand == "BR") {
            if (SEOPageTitle.contains(" | Banana Republic")) {
                SEOPageTitle = SEOPageTitle.slice(0, -17);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Discover a spirit of adventure, shop "
                var temp2 = "at Banana Republic for thoughtfully designed classics, crafted from luxurious materials with an eye towards sustainability."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
                
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = "Découvrez un esprit d’aventure; magasinez "
                var temp2 = " à Banana Republic et trouvez des classiques créés judicieusement avec des matières luxueuses dans un souci de durabilité."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }

        if (brand == "BRFS") {
            if (SEOPageTitle.contains(" | Banana Republic Factory")) {
                SEOPageTitle = SEOPageTitle.slice(0, -25);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop "
                var temp2 = "at Banana Republic Factory, designed for a life with no boundaries."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = ""
                var temp2 = " chez Banana Republic Entrepôt : découvrez des vêtements conçus pour une vie sans limites."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }

        if (brand == "ON") {
            if (SEOPageTitle.contains(" | Old Navy")) {
                SEOPageTitle = SEOPageTitle.slice(0, -11);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Old Navy for "
                var temp2 = ", find essential styles & fashion trends for the family at amazing prices."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Old Navy des "
                var temp2 = " ainsi que des essentiels mode pour toute la famille à des prix incroyables."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }

        if (brand == "GAP") {
            if (SEOPageTitle.contains(" | Gap") || SEOPageTitle.contains(" | GAP")) {
                SEOPageTitle = SEOPageTitle.slice(0, -5);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Gap for the "
                var temp2 = "you need. Our iconic pieces. Your personal style. Since 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Gap les "
                var temp2 = " que vous recherchez. Nos vêtements emblématiques. Votre style personnel. Depuis 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }

        if (brand == "GO") {
            if (SEOPageTitle.contains(" | Gap Factory")) {
                SEOPageTitle = SEOPageTitle.slice(0, -13);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Gap for the "
                var temp2 = "you need. Our iconic pieces. Your personal style. Since 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Gap les "
                var temp2 = " que vous recherchez. Nos vêtements emblématiques. Votre style personnel. Depuis 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }

        if (brand == "AT") {
            if (SEOPageTitle.contains(" | Athleta")) {
                SEOPageTitle = SEOPageTitle.slice(0, -10);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop for "
                var temp2 = " at Athleta, a premium fitness & lifestyle brand that creates versatile performance apparel to inspire a community of active, confident women."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez des modèles pour "
                var temp2 = " chez Athleta, une marque de vêtements polyvalents et de haute qualité qui conviennent aussi bien à l’activité physique qu’à la vie de tous les jours et qui inspirent une communauté de femmes actives et bien dans leur peau."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                node.getValue("a_SEO_Meta_Description").setSimpleValue(SEOMetaDescription);

            }
            }
        }
    }
}


function generatePageDescriptionBasedOnInput(step,node,oldPageTitle) {
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var SEOPageTitle = oldPageTitle;
    log.info(SEOPageTitle);
    var Context = step.getCurrentContext().getID();

    if (SEOPageTitle != null) {

        if (brand == "BR") {
            if (SEOPageTitle.contains(" | Banana Republic")) {
                SEOPageTitle = SEOPageTitle.slice(0, -17);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Discover a spirit of adventure, shop "
                var temp2 = "at Banana Republic for thoughtfully designed classics, crafted from luxurious materials with an eye towards sustainability."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);

                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = "Découvrez un esprit d’aventure; magasinez "
                var temp2 = " à Banana Republic et trouvez des classiques créés judicieusement avec des matières luxueuses dans un souci de durabilité."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }

        if (brand == "BRFS") {
            if (SEOPageTitle.contains(" | Banana Republic Factory")) {
                SEOPageTitle = SEOPageTitle.slice(0, -25);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop "
                var temp2 = "at Banana Republic Factory, designed for a life with no boundaries."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = ""
                var temp2 = "chez Banana Republic Entrepôt : découvrez des vêtements conçus pour une vie sans limites."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }

        if (brand == "ON") {
            if (SEOPageTitle.contains(" | Old Navy")) {
                SEOPageTitle = SEOPageTitle.slice(0, -11);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Old Navy for "
                var temp2 = ", find essential styles & fashion trends for the family at amazing prices."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Old Navy des "
                var temp2 = " ainsi que des essentiels mode pour toute la famille à des prix incroyables."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }

        if (brand == "GAP") {
            if (SEOPageTitle.contains(" | Gap") || SEOPageTitle.contains(" | GAP")) {
                SEOPageTitle = SEOPageTitle.slice(0, -5);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Gap for the "
                var temp2 = "you need. Our iconic pieces. Your personal style. Since 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Gap les "
                var temp2 = " que vous recherchez. Nos vêtements emblématiques. Votre style personnel. Depuis 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }

        if (brand == "GO") {
            if (SEOPageTitle.contains(" | Gap Factory")) {
                SEOPageTitle = SEOPageTitle.slice(0, -13);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop Gap for the "
                var temp2 = "you need. Our iconic pieces. Your personal style. Since 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez chez Gap les "
                var temp2 = " que vous recherchez. Nos vêtements emblématiques. Votre style personnel. Depuis 1969."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }

        if (brand == "AT") {
            if (SEOPageTitle.contains(" | Athleta")) {
                SEOPageTitle = SEOPageTitle.slice(0, -10);
                if (Context == "EN_US" || Context == "EN_CA") {

                var temp1 = "Shop for "
                var temp2 = " at Athleta, a premium fitness & lifestyle brand that creates versatile performance apparel to inspire a community of active, confident women."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            } else if (Context == "FR_CA") {

                var temp1 = "Trouvez des modèles pour "
                var temp2 = " chez Athleta, une marque de vêtements polyvalents et de haute qualité qui conviennent aussi bien à l’activité physique qu’à la vie de tous les jours et qui inspirent une communauté de femmes actives et bien dans leur peau."

                var SEOMetaDescription = temp1 + SEOPageTitle + temp2;

                SEOMetaDescription = SEOMetaDescription.slice(0 , 185);
          
                return SEOMetaDescription;

            }
            }
        }
    }
    //return oldPageTitle;
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.slugify = slugify
exports.slugify = slugify
exports.extend = extend
exports.convertString = convertString
exports.removeWords = removeWords
exports.SEOcheckcondition = SEOcheckcondition
exports.copyAttributesFromOneContextToAnother = copyAttributesFromOneContextToAnother
exports.generatePageDescription = generatePageDescription
exports.generatePageDescriptionBasedOnInput = generatePageDescriptionBasedOnInput