# AttributeControl

## CDN
```url
https://cdn.jsdelivr.net/gh/kento-nkr/AttributeControl/AttributeControl.js
```

## 使い方

1. **クラスのインスタンス化**

    ```js
    const AC = new AttributeControl(); //attributeを設定
    ```

    - 名前空間や拡張性のために、本プログラムはclassを使用
    - 使用にはインスタンス化が必須
2. **Attributeの指定**

    ```js
    const autocompleteList_obj = {
        //fieldcode : {attribute_type : attribute},
        個人メールアドレス: { autocomplete: "email", inputmode: "email" },
        姓戸籍: { autocomplete: "family-name" },
        名戸籍: { autocomplete: "given-name" },
        郵便番号: {
            autocomplete: "postal-code",
            placeholder: "0000000",
            inputmode: "numeric",
        },
        性別戸籍: { autocomplete: "sex", list: "sex_select" },
        管理者メールアドレス: {autocomplete: "email"}
    };
    ```

    - `fieldcode : {attribute_type : attribute}`で定義
    - `fieldcode`はFBで定義している文字列
    - `attribute_type`および`attribute`は[こちら](https://developer.mozilla.org/ja/docs/Web/HTML/Attributes)を参照
    - 後述のdatalist(プルダウン)を実装の場合は、`attribute_type = list`にし、`attribute`に設定する値は、グローバル一意であるようにする

3. **指定したAttributeを反映**

    ```js
    AC.setAttribute(autocompleteList_obj);
    ```

    インスタンス化したクラスの、`setAttribute`メソッドを実行

4. **動的プルダウンの作成**

    ```js
    const datalist_object = [
        { value: "回答しない", code: "0" }, 
        { value: "男性", code: "1" }, 
        { value: "女性", code: "2" }
    ]
    AC.update_datalist("sex_select", datalist_object)
    ```

    - インスタンス化したクラスの、`update_datalist`メソッドを実行
    - 第1引数: datalistのid. `autocompleteList_obj`で定義したものと同一のものにしないと指定できない
    - 第2引数: 設定する値。`{value: "", code: ""}`を配列にしたもの  
    `value`は実際にinput elementに入力される値、`code`はプルダウン時にしか表示されない文字列
    - `code`が必要ない場合は、`""`を設定すればよい。プルダウンには`value`しか表示されない

        ```js
        { value: "女性", code: "" }
        ```
    - `code`を設定した場合、プルダウンには`(code) value`の形式で表示される  
       ![image](https://github.com/kento-nkr/AttributeControl/assets/127807502/1270e678-bfca-48e3-8833-071bc39886a2)

5. **動的チェックボックスの作成**

    ```js
    const checkbox_object = [
        { value: "test1@example.com", code: "1" }, 
        { value: "test2@example.com", code: "2" }, 
        { value: "test3@example.com", code: "3" }, 
        { value: "test4@example.com", code: "4" }, 
        { value: "test5@example.com", code: "5" }, 
    ]
    AC.update_checkbox("管理者メールアドレス", checkbox_object)
    ```

    - インスタンス化したクラスの、`checkbox_object`メソッドを実行
    - 第1引数: FBのfieldcode
    - 第2引数: 設定する値。`{value: "", code: ""}`を配列にしたもの  
    `value`は実際にinput elementに入力される値、`code`はプルダウン時にしか表示されない文字列
    - `code`が必要ない場合は、`""`を設定すればよい。プルダウンには`value`しか表示されない

        ```js
        { value: "test1@example.com", code: "" }
        ```
    - `code`を設定した場合、プルダウンには`(code) value`の形式で表示される  
       ![checkbox image](https://github.com/kento-nkr/AttributeControl/assets/141007261/3c52ef03-472f-4000-86d3-73e6b4794f4d)

6. **ドロップダウン、チェックボックスの入力制限**

    ```js
    AC.update_limitation("性別戸籍")
    AC.update_readOnly("管理者メールアドレス（レベル1）")
    ```

    - インスタンス化したクラスの、`update_limitation`メソッドもしくは、`update_readOnly`メソッドを実行
    - 第1引数: FBのfieldcode
    - ドロップダウン及びチェックボックスが実装されているinput elementへの入力をドロップダウンもしくはチェックボックスからの入力のみに制限できる
    - ドロップダウンの入力制限は`update_limitation`メソッドを使用
    - チェックボックスの入力制限は`update_limitation`メソッド（非推奨）もしくは、`update_readOnly`メソッド（推奨）を使用

## サンプルプログラム

```js

    const AC = new AttributeControl(); //attributeを設定
    const autocompleteList_obj = {
        //fieldcode : {attribute_type : attribute},
        個人メールアドレス: { autocomplete: "email", inputmode: "email" },
        姓戸籍: { autocomplete: "family-name" },
        名戸籍: { autocomplete: "given-name" },
        郵便番号: {
            autocomplete: "postal-code",
            placeholder: "0000000",
            inputmode: "numeric",
        },
        性別戸籍: { autocomplete: "sex", list: "sex_select" }
    };
    AC.setAttribute(autocompleteList_obj);
    const datalist_object = [
        { value: "回答しない", code: "0" }, 
        { value: "男性", code: "1" }, 
        { value: "女性", code: "2" }
    ]
    const checkbox_object = [
        { value: "test1@example.com", code: "1" }, 
        { value: "test2@example.com", code: "2" }, 
        { value: "test3@example.com", code: "3" }, 
        { value: "test4@example.com", code: "4" }, 
        { value: "test5@example.com", code: "5" }, 
    ]
    AC.update_datalist("sex_select", datalist_object)
    AC.update_checkbox("管理者メールアドレス", checkbox_object)
    AC.update_limitation("性別戸籍")
    AC.update_limitation("管理者メールアドレス")
```
