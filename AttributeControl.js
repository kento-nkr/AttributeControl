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
                this.set(
                    fieldcode,
                    attribute_type,
                    attributeList_obj[attribute_type]
                );
            });
        });
    }

    set(fieldcode, attribute_type, attribute)
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

    update_datalist(datalist_id, dataObject)
    {
        // dataObject = [{value:???, code:???},]
        if (document.getElementById(datalist_id)) document.getElementById(datalist_id).remove()
        const new_datalist = document.createElement("datalist");
        new_datalist.id = datalist_id;
        dataObject.forEach((obj) =>
        {
            const newOption = document.createElement("option");
            newOption.value = obj.value;
            if (obj.code === "")
                newOption.label = "";
            else
                newOption.label = `(${obj.code})`;
            new_datalist.appendChild(newOption);
        });
        document.body.appendChild(new_datalist)
    }

    update_checkbox(fieldcode, dataObject) {
        // dataObject = [{value:???, code:???},]
        const targetElement = this.#get_element_byfieldcode(fieldcode);
        if (document.getElementById(fieldcode)) document.getElementById(fieldcode).remove()
        const new_div = document.createElement("div");
        new_div.id = fieldcode;
        new_div.style.display = "none";
        new_div.style.position = "absolute";
        new_div.style.background = "white";
        new_div.style.border = "1px solid #ccc";
        new_div.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
        new_div.style.zIndex = "1000";
        new_div.style.borderRadius = ".25em";
    
        dataObject.forEach((obj, index) => {
            if (!obj.value) return;
            const checkboxWrapper = document.createElement("div");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox-${fieldcode}-${index}`;
            checkbox.value = obj.value;
            checkbox.style.borderRadius = ".25em";
    
            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.innerText = obj.code ? `(${obj.code}) ${obj.value}` : obj.value;

            checkbox.addEventListener('change', updateCheckedValues);
            label.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                checkbox.checked = !checkbox.checked;
                updateCheckedValues();
            });
    
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            new_div.appendChild(checkboxWrapper);
        });
    
        function updateCheckedValues() {
            const checkboxes = document.getElementById(fieldcode).childNodes;
            let checkedValues = []
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].getElementsByTagName("input")[0].checked) {
                    checkedValues.push(checkboxes[i].getElementsByTagName("input")[0].value)
                }
            }
            record[fieldcode].value = checkedValues.join(', ');
        }
    
        targetElement.after(new_div);
    
        targetElement.addEventListener('focus', function() {
            new_div.style.display = 'block';
        });
    
        document.addEventListener('click', function(event) {
            if (!targetElement.contains(event.target) && !new_div.contains(event.target)) {
                new_div.style.display = 'none';
            }
        });
    }
    
    // ドロップダウンやチェックボックスの項目以外の入力を拒否
    update_limitation(fieldcode, dataObject) {
        // dataObject = [{value:???, code:???},]
        const list = dataObject.map(item => item.value); // valueのみの配列に変換
        const targetElement = this.#get_element_byfieldcode(fieldcode);
        targetElement.addEventListener("input", (event) => {
            let flag = false;
            const parts = event.target.value.split(',').map(part => part.trim()); // 入力されている文字列を","区切りで配列に保管
            // 保管されている配列に一致するものがあるかチェック
            for (let part of parts) {
                if (!list.includes(part)) {
                    flag = true;
                }
            }
            // ない場合入力文字列をクリア
            if (flag) {
              event.target.value = "";
            }
        });
    }
    
    // チェックボックスにのみ有効
    update_readOnly(fieldcode) {
        const targetElement = this.#get_element_byfieldcode(fieldcode);
        targetElement.readOnly = true;
    }
}

