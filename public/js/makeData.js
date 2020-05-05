/** formからpostされたdataをdata Objectに詰める
 * 
 * @param {Object} body 
 */
exports.makeJson = function (body) {
    var data = {
        name_jp: body.name_jp,
        name_en: "",
        birth: body.birth,
        star: body.star,
        height: body.height,
        birthplace: body.birthplace,
        blood: body.bloods
    }
    return data
}

/** グループ名と名前の取得
 * 
 * @param {Object} body 
 */
exports.makeGroupAndName = function (data) {
    const groupAndName = {};
    Object.keys(data).map(function (value1, index) {
        groupAndName[data[value1].group] = {};
        Object.keys(data[value1]["menber"]).map(function (value2, index) {
            groupAndName[data[value1].group][value2] = [];
            Object.keys(data[value1]["menber"][value2]).map(function (value3, index) {
                groupAndName[data[value1].group][value2].push(
                    {
                        num: value3,
                        name_jp: data[value1]["menber"][value2][value3].name_jp,
                    }
                );
            });
        });
    })
    return groupAndName;
}