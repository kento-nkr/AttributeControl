//編集の必要なし
/*
  フォームブリッジ上の特定のフィールドコードに対して属性を付与するためのプログラム
  setAttributeByObject(autocompleteList_obj)しか使用しない
  autocompleteList_objは{fieldcode : {attribute_type : attribute},...}という構造をとる.。オブジェクトを複数個連結することで、複数のdom elemntに属性を一括付与できる
  attribute_typeはDOMイベントすべてに対応
    - autocomplete : 自動入力を有効にする際の属性タグ。emailやtelなどから選択。詳細はリファレンスを参照
    - placeholder : 文字入力がされる際にうっすらと表示される文字列。1文字目の入力とともに見えなくなる

  //example
    const autocompleteList_obj = {
      メールアドレス: { autocomplete: "email" },
      姓: { autocomplete: "family-name" },
      名: { autocomplete: "given-name" },
      郵便番号: { autocomplete: "postal-code", placeholder: "0000000" },
      性別: { autocomplete: "sex" },
      電話番号: { autocomplete: "tel" },
      本人マイナンバー: { placeholder: "000000000000" },
    };
    setAttributeByObject(autocompleteList_obj);

    >>フィールドコード＝メールアドレスにemailの自動入力属性を付与
    >>フィールドコード＝姓にfamily-nameの自動入力属性を付与
    ...
*/
class AttributeControl
{
    constructor()
    { }

    // autocompleteList_obj = {fieldcode : {attribute_type : attribute},}
    setAttribute(autocompleteList_obj)
    {
        Object.keys(autocompleteList_obj).forEach((fieldcode) =>
        {
            //各autocompleteList_objに対して
            const attributeList_obj = autocompleteList_obj[fieldcode];
            Object.keys(attributeList_obj).forEach((attribute_type) =>
            {
                //各attributeに対して
                this.#set(
                    fieldcode,
                    attribute_type,
                    attributeList_obj[attribute_type]
                );
            });
        });
    }

    #set(fieldcode, attribute_type, attribute)
    {
        try
        {
            const targetElement = this.#get_element_byfieldcode(fieldcode);
            targetElement.setAttribute(attribute_type, attribute);
            if (attribute_type === "autocomplete")
                targetElement.setAttribute("name", attribute);
        } catch (e)
        {
            console.error(`set_attribute error\n  fieldcode=${fieldcode}\n  detail=${e}`);
        }
    }

    #get_element_byfieldcode(fieldcode)
    {
        try
        {
            if (!fieldcode in fb.events.fields) return null;
            const textField = document.querySelector(
                `[data-vv-name="${fieldcode}"]`
            ).parentElement;
            if (textField == null) return null;
            const input_element = textField.getElementsByTagName("input")[0]; //htmlのinputタグを検索
            return input_element;
        } catch (e)
        {
            console.error(`get_element error:\n fieldcode=${fieldcode}\n detail=${e}`);
        }
    }

}

