
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const { join } = require('path');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

const makeData = require('./public/js/makeData.js');

const { readFileSync } = require('fs');
const dataNogi = readFileSync(join(__dirname, './data/nogi.json'));
const dataKeyaki = readFileSync(join(__dirname, './data/keyaki.json'));
const dataHinata = readFileSync(join(__dirname, './data/hinata.json'));
const nogi = JSON.parse(dataNogi, 'utf8');
const keyaki = JSON.parse(dataKeyaki, 'utf8');
const hinata = JSON.parse(dataHinata, 'utf8');
const allData = {
    nogi: nogi,
    keyaki: keyaki,
    hinata: hinata
};

// GroupNmae + Name
const groupAndName = makeData.makeGroupAndName(allData);

// Top
app.get('/', (req, res) => {
    res.render('top.ejs',
        {
            title: 'top',
            content: 'トップページです！',
            data: groupAndName,
        })
})

// 一覧
app.get('/list', (req, res) => {
    res.render('list.ejs',
        {
            title: 'list',
            content: 'listページです！',
            link_e: { href: '/edit', text: '編集' },
            data: (req.query.grp === 'nogi') ? allData["nogi"]
                : (req.query.grp === 'keyaki') ? allData["keyaki"]
                    : allData["hinata"]
        })
});

// プロフィール
app.get('/profile', (req, res) => {
    res.render('profile.ejs',
        {
            title: 'profile',
            content: '個人ページです！',
            data: allData[req.query.grp]["menber"][req.query.gene][req.query.num],
        })
})

// 登録
app.get('/regist', (req, res) => {
    res.render('regist.ejs',
        {
            title: 'regist',
            content: 'registページです！',
            grp: req.query.grp,
        })
})

// 編集
app.get('/edit', (req, res) => {
    const data = (req.query.grp === "nogi") ? allData["nogi"]
        : (req.query.grp === "keyaki") ? allData["keyaki"]
            : allData["hinata"];
    res.render('edit.ejs',
        {
            title: 'edit',
            content: 'editページです！',
            grp: req.query.grp,
            gene: req.query.gene,
            num: req.query.num,
            data: data["menber"][req.query.gene][req.query.num]
        })
})

// 結果
app.get('/result', (req, res) => {
    res.render('result.ejs',
        {
            title: 'result',
            content: '完了です！',
        })
})

// 更新
app.post('/upload', (req, res) => {
    if (req.query.gene) {
        // edit
        allData[req.query.grp]["menber"][req.query.gene][req.query.num] = makeData.makeJson(req.body);
    } else {
        // regist
        allData[req.body.grp]["menber"][req.body.gene][Object.keys(allData[req.body.grp]["menber"][req.body.gene]).length] = makeData.makeJson(req.body);
    }

    res.render('result.ejs',
        {
            title: 'result',
            content: 'resultページです！',
        })
})

module.exports = app;
