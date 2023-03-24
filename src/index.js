//V4.0
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 5000);
var sessionstorage = require("sessionstorage");

if (typeof sessionstorage["user"] == "undefined") {
  sessionstorage["user"] = 0;
}

//////////////////////////////////////////////////////khoi tao mang luu cong khai
var mangUsers2 = []; //luu tao phong
var mangUsers3 = []; //luu gia tri bo luot
var mangUsers_thoat = []; //user thoat
var mang_ten = [];
var mang_ten1 = [];
var mangUsers_ket_thuc_van = []; //van bat dau hay ket thuc
var mangUsers_ban_tam = [];
//////////////////////////////
var mangUsers_trang_thai_ban = [];
var mangUsers_trang_thai_ban_tam1 = [];
var mangUsers_chat = [];
////////////////////////////
var mang_gia_tri_thang = [];
var mang_gia_tri_huong_sai = [];
var mang_bai_con_lai = [];
////////////////////////////thoat
var mang_thoat_game = [];
///////////////////////////////////
var mang_tam = [];
var mang_luu_trang_thai_choi = [];
var listMessages = [];
var check_admin = 0;
var save_render;

app.get("/", function (req, res) {
  res.render("trangchu");
});

io.on("connection", function (socket) {
  //console.log("connection: "+socket.id);
  class On_Off {
    constructor(a, b, c, d) {
      this.A = a;
      this.B = b;
      this.C = c;
      this.D = d;
    }
  }
  class Thong_Tin {
    constructor(id, ban, t_s1, t_s2) {
      this.ID = id;
      this.BAN = ban;
      this.T_S1 = t_s1;
      this.T_S2 = t_s2;
    }
  }
  class Bai_Con {
    constructor(bai, s) {
      this.BAI = bai;
      this.S = s;
    }
  }
  function mc_k(a, b, c) {
    var d = [];
    for (i = 0; i < a.length; i++) {
      if (a[i].BAN == c) {
        d.push(a[i]);
      }
    }
    for (i = 0; i < d.length; i++) {
      var j = b.findIndex((x) => x.ID === d[i].ID);
      if (j >= 0) {
        d[i].T_S2 = b[j].T_S1;
      }
    }
    return d;
  }
  function chuyenchuoi(a) {
    g = [];

    for (var i = 0; i < a.length; i++) {
      g.push(parseInt(a[i].substring(4, 6))); //substring cat chuoi
    }
    return g;
  }

  function sortNumberAsc(a, b) {
    return a - b;
  }
  function ktrasanh(data) {
    var v = [];
    v = chuyenchuoi(data);
    v.sort(sortNumberAsc); //sap xep mang tang dan

    for (var i = 0; i < v.length - 1; i++) {
      if (v[i] + 1 == v[i + 1]) {
        //kiem tra ex: 1,2,3,4,5...
        t = 0;
      } else {
        t = 1;
        break;
      }
    }
    return t;
  }
  function ktradoithong(data) {
    var v = [];
    v = chuyenchuoi(data);

    v.sort(sortNumberAsc); //sap xep mang tang dan
    //console.log(v);

    for (var i = 0; i < v.length - 2; i += 2) {
      if (v[i] == v[i + 1] && v[i] + 1 == v[i + 2]) {
        //kiem tra ex: 1,2,3,4,5...
        t = 0;
      } else {
        t = 1;
        break;
      }
    }
    return t;
  }
  function ktra_4_heo(a) {
    var kq1 = [];
    if (a.indexOf("anh/16a.png") >= 0) {
      kq1.push("anh/16a.png");
    }
    if (a.indexOf("anh/16b.png") >= 0) {
      kq1.push("anh/16b.png");
    }
    if (a.indexOf("anh/16c.png") >= 0) {
      kq1.push("anh/16c.png");
    }
    if (a.indexOf("anh/16d.png") >= 0) {
      kq1.push("anh/16d.png");
    }
    return kq1;
  }
  function AIktra_doithong(x1) {
    //doi thong: bao gom ket hop mang cua AIktra_doi
    var a3 = [],
      b1 = [],
      b2 = [];
    //alert(x1);
    for (var j = 0; j < x1.length; j++) {
      if (j % 2 == 0) {
        b1.push(x1[j]);
      } else {
        b2.push(x1[j]);
      }
    }

    for (var j = 0; j < b1.length - 1; j++) {
      if (
        parseInt(b1[j].substring(4, 6)) + 1 ==
        parseInt(b1[j + 1].substring(4, 6))
      ) {
        if (a3 == "") {
          a3.push(b1[j]); //3,4,5,7,8,9
          a3.push(b2[j]);
          a3.push(b1[j + 1]);
          a3.push(b2[j + 1]);
        } else {
          if (a3.indexOf(b1[j]) < 0 && a3.indexOf(b2[j]) < 0) {
            a3.push(b1[j]); //3,3,4,4,5,5,7,7
            a3.push(b2[j]);
          } else if (a3.indexOf(b1[j + 1]) < 0 && a3.indexOf(b2[j + 1]) < 0) {
            a3.push(b1[j + 1]);
            a3.push(b2[j + 1]);
          }
        }
      } else if (
        parseInt(b1[j].substring(4, 6)) + 1 !=
          parseInt(b1[j + 1].substring(4, 6)) &&
        a3.length <= 4
      ) {
        a3 = [];
      } else {
        b1.splice(j + 1, 1);
        b2.splice(j + 1, 1);
        j--;
      }
    }
    if (a3.length <= 4) {
      a3 = [];
    }

    return a3;
  }
  function kiemtrahople(data) {
    dem = data.length;
    var g = "";
    if (dem == 1 && data != "") {
      g = "coc";
    } else if (dem == 2) {
      c1 = parseInt(data[0].substring(4, 6));
      c2 = parseInt(data[1].substring(4, 6));
      if (c1 == c2) {
        g = "doi";
      } else {
        g = "khonghople";
      }
    } else if (dem > 2) {
      if (ktrasanh(data) == 0) {
        g = "sanh";
      } else {
        if (dem == 3) {
          c1 = parseInt(data[0].substring(4, 6));
          c2 = parseInt(data[1].substring(4, 6));
          c3 = parseInt(data[2].substring(4, 6));
          if (c1 == c2 && c2 == c3) {
            g = "xamco";
          } else {
            g = "khonghople";
          }
        } else if (dem == 4) {
          c1 = parseInt(data[0].substring(4, 6));
          c2 = parseInt(data[1].substring(4, 6));
          c3 = parseInt(data[2].substring(4, 6));
          c4 = parseInt(data[3].substring(4, 6));
          if (c1 == c2 && c1 == c3 && c1 == c4) {
            g = "tuqui";
          } else {
            g = "khonghople";
          }
        } else if (dem == 6) {
          if (ktradoithong(data) == 0) {
            g = "3doithong";
          } else {
            g = "khonghople";
          }
        } else if (dem == 8) {
          if (ktradoithong(data) == 0) {
            g = "4doithong";
          } else {
            g = "khonghople";
          }
        } else if (dem == 10) {
          if (ktradoithong(data) == 0) {
            g = "5doithong";
          } else {
            g = "khonghople";
          }
        } else if (dem == 12) {
          if (ktradoithong(data) == 0) {
            g = "6doithong";
          } else {
            g = "khonghople";
          }
        } else {
          g = "khonghople";
        }
      }
    }
    return g;
  }
  function trung_lap(a) {
    var seen = {};
    return a.filter(function (item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
  function AIktra_doi(x1) {
    //doi

    function in_of(a) {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        b.push(a[i].substring(4, 6));
      }
      return b;
    }

    var a1 = [],
      a2 = [],
      a3 = [];

    for (
      var i = 0;
      i < x1.length - 1;
      i++ //3344455
    ) {
      if (x1[i].substring(4, 6) == x1[i + 1].substring(4, 6)) {
        if (a1 != "") {
          a2 = in_of(a1);
          if (a2.indexOf(x1[i].substring(4, 6)) < 0) {
            a1.push(x1[i]);
            a1.push(x1[i + 1]);
            //a1=trung_lap(a3);
          }
        } else {
          a1.push(x1[i]);
          a1.push(x1[i + 1]);
        }
      }
    }
    //  alert(a1);
    return a1;
  }
  function AIktra_sanh(a) {
    function loc_sanh(a, b) {
      var t = -1;
      for (var i = 0; i < a.length; i++) {
        if (b.substring(4, 6) == a[i].substring(4, 6)) {
          t = i;
          break;
        }
      }
      return t;
    }
    var b = [],
      c = [],
      dem = 0,
      dem1 = 0;
    for (var i = 0; i < a.length - 1; i++) {
      if (
        parseInt(a[i].substring(4, 6)) + 1 ==
        parseInt(a[i + 1].substring(4, 6))
      ) {
        if (b == "") {
          b.push(a[i]);
          b.push(a[i + 1]);
        } else {
          if (dem == 1 && loc_sanh(b, a[i]) < 0) {
            b.push(a[i]);
            b.push(a[i + 1]);
            dem = 0;
          } else {
            b.push(a[i + 1]);
          }
        }
      } else {
        dem = 1;
      }
    }
    for (var j = 0; j < b.length - 1; j++) {
      if (
        parseInt(b[j].substring(4, 6)) + 1 ==
        parseInt(b[j + 1].substring(4, 6))
      ) {
        if (dem1 == 1) {
          c.push(b[j - 1]);

          c.push(b[j]);
          c.push(b[j + 1]);
          c = trung_lap(c);
        }

        dem1 = 1;
      } else {
        dem1 = 0;
      }
    }
    return c;
  }
  function _xoa_mang_mangUsers2_con_1_nguoi(a, b, c) {
    //[ Thong_Tin { ID: '?', BAN: 'ban00', T_S1: 'on', T_S2: undefined } ]
    var k = [],
      v = [];
    for (var i = 0; i < a.length; i++) {
      if (b.findIndex((X) => X.ID === a[i].ID) < 0 && a[i].BAN == c) {
        k.push(a[i]);
        break;
      }
    }
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN != c) {
        v.push(a[i]);
      }
    }

    return v.concat(k);
  }
  function _giao_2_mang_trung_p_t(a, b) {
    //[ Thong_Tin { ID: '?', BAN: 'ban00', T_S1: 'on', T_S2: undefined } ]
    var e = [];

    for (var i = 0; i < a.length; i++) {
      if (b.findIndex((X) => X.ID === a[i].ID) < 0) {
        e.push(a[i]);
      }
    }

    return e;
  }
  function _update_xoa_mang_all(a, b, d) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }
    for (var i = 0; i < c.length; ) {
      if (b.findIndex((X) => X.ID === c[i]) >= 0 && c[i].BAN == d) {
        c.splice(i, 1);
      } else {
        i++;
      }
    }
    return c;
  }
  function loc_ten2(a, b) {
    var c = [];

    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        c.push(a[i].T_S1);
      }
    }
    return c;
  }
  function _update_xoa_mang_con_lai(a, b, d) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }
    for (var i = 0; i < c.length; ) {
      if (
        b.findIndex((X) => X.ID === c[i].ID) >= 0 &&
        c[i].BAN == d &&
        b.findIndex((X) => X.ID === c[i].BAN) >= 0
      ) {
        c.splice(i, 1);
      } else {
        i++;
      }
    }
    return c;
  }
  function _update_xoa_mang_ten(a, b, d) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }
    for (var i = 0; i < c.length; ) {
      if (b.findIndex((X) => X.ID === c[i].ID) >= 0 && c[i].BAN == d) {
        c.splice(i, 1);
      } else {
        i++;
      }
    }
    return c;
  }
  function _xem_nguoi_tiep_tuc_danh(a, b, c) {
    var d = "";

    for (var i = 0; i < a.length; i++) {
      if (b.findIndex((X) => X.ID === a[i].ID) < 0 && a[i].BAN == c) {
        d = a[i].ID;
        break;
      }
    }

    return d;
  }

  function _luu_on_off_user(a, b, d) {
    //_luu_on_off_user(mang_luu_trang_thai_choi,socket.ban1,"on");
    var e = [];
    if (a.findIndex((X) => X.BAN === b) < 0) {
      e.push(new Thong_Tin("?", b, "on"));
    }
    for (var i = 0; i < a.length; i++) {
      e.push(a[i]);
    }
    for (var i = 0; i < e.length; i++) {
      if (e[i].BAN == b) {
        e[i].T_S1 = d;
        break;
      }
    }
    /*if(a!=[]){
			var t=0;
			for(var i=0;i<e.length;i++){
				if(e[i].BAN==b && e[i].substring(5)==c){
					e[i]=b+c;
					t=1
					break;
				}else if(e[i].BAN==b && e[i].substring(5)!=c){
					e[i]=b+c;
					t=1;
					break;
				}
			}
			if(t==0){
				 e.push(b+c);
			}
		 }else{
			 e.push(b+c);
		 }*/
    return e;
  }
  function xoa_mang1(a, b) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }

    for (
      var i = 0;
      i < c.length; //xoa id user mang_tam

    ) {
      if (c[i].BAN + c[i].ID == b) {
        c.splice(i, 1);
      } else {
        i++;
      }
    }
    return c;
  }
  function mc5(a, b) {
    var c = [];
    if (a != []) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) {
          c.push(a[i]);
        }
      }
    }
    return c;
  }
  function mang_gia_tri_huong_sai_nap_chong(a, b, d) {
    var e = [];
    var c = mc5(a, b);
    if (c != []) {
      e = [];
      e.push(d);
    } else {
      e.push(d);
    }
    return e;
  }
  function xem_huong_sai(a, b) {
    var c = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        c = 1;
        break;
      }
    }
    return c;
  }
  function lay_huong_sai(a, b, d) {
    var c = "",
      e = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        c = a[i];
        break;
      }
    }
    e = d.indexOf(c);
    return e;
  }
  function loc_mang_gia_tri_con_lai(a, b) {
    var c = "";

    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b && a[i].T_S1 != "") {
        c = a[i].T_S1;
      }
    }

    return c;
  }
  function loc_mang_gia_tri_con_lai_2(a, b) {
    var c = "";

    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b && a[i].T_S1 != "") {
        c = a[i];
      }
    }

    return c;
  }
  function loc_bai_con_lai(a, b, e, f) {
    var c = [],
      d = 0;
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }
    for (var j = 0; j < c.length; j++) {
      if (c[j].ID + c[j].BAN == b + e) {
        d = 1;
        break;
      }
    }
    if (d == 1) {
      for (var i = 0; i < c.length; i++) {
        if (c[i].ID + c[i].BAN == b + e) {
          if (e == "") {
            c.splice(i, 1);
          } else {
            c[i] = new Thong_Tin(b, e, f);
          }
        }
      }
    } else {
      c.push(new Thong_Tin(b, e, f));
    }
    return c;
  }
  function demboluottoinhat2nguoi(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) dem++;
    }
    return dem;
  }
  function aaaa(a, b) {
    var c = 0;

    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        c = 1;
        break;
      }
    }

    return c;
  }
  function chuyen_chuoi_ve_mang(a, b, d) {
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c.push(a[i]);
    }
    for (var i = 0; i < c.length; i++) {
      if (c[i] == d) {
        c[i] = b + c[i];
      }
    }

    return c;
  }

  function dem_nguoichoi_ban_b_n(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) dem++;
    }
    return dem;
  }
  function trang_thai_ban_them(a, b) {
    var c = [];

    if (a.indexOf(b) < 0) {
      c.push(b);
    }

    return c;
  }

  function chuyen_ban_lon(a) {
    var c = "",
      d = [
        "ban50",
        "ban51",
        "ban52",
        "ban53",
        "ban54",
        "ban55",
        "ban56",
        "ban57",
        "ban58",
        "ban59",
        "ban60",
        "ban61",
        "ban62",
        "ban63",
        "ban64",
        "ban65",
        "ban66",
        "ban67",
        "ban68",
        "ban69",
        "ban70",
        "ban71",
        "ban72",
        "ban73",
        "ban74",
        "ban75",
        "ban76",
        "ban77",
        "ban78",
        "ban79",
        "ban80",
        "ban81",
        "ban82",
        "ban83",
        "ban84",
        "ban85",
        "ban86",
        "ban87",
        "ban88",
        "ban89",
        "ban90",
        "ban91",
        "ban92",
        "ban93",
        "ban94",
        "ban95",
        "ban96",
        "ban97",
        "ban98",
        "ban99",
      ];
    c = d[parseInt(a.substring(5, 3))];

    return c;
  }
  function chuyen_ban_nho(a) {
    var e = "";
    var d = [
      "ban50",
      "ban51",
      "ban52",
      "ban53",
      "ban54",
      "ban55",
      "ban56",
      "ban57",
      "ban58",
      "ban59",
      "ban60",
      "ban61",
      "ban62",
      "ban63",
      "ban64",
      "ban65",
      "ban66",
      "ban67",
      "ban68",
      "ban69",
      "ban70",
      "ban71",
      "ban72",
      "ban73",
      "ban74",
      "ban75",
      "ban76",
      "ban77",
      "ban78",
      "ban79",
      "ban80",
      "ban81",
      "ban82",
      "ban83",
      "ban84",
      "ban85",
      "ban86",
      "ban87",
      "ban88",
      "ban89",
      "ban90",
      "ban91",
      "ban92",
      "ban93",
      "ban94",
      "ban95",
      "ban96",
      "ban97",
      "ban98",
      "ban99",
    ];
    c = [
      "ban00",
      "ban01",
      "ban02",
      "ban03",
      "ban04",
      "ban05",
      "ban06",
      "ban07",
      "ban08",
      "ban09",
      "ban10",
      "ban11",
      "ban12",
      "ban13",
      "ban14",
      "ban15",
      "ban16",
      "ban17",
      "ban18",
      "ban19",
      "ban20",
      "ban21",
      "ban22",
      "ban23",
      "ban24",
      "ban25",
      "ban26",
      "ban27",
      "ban28",
      "ban29",
      "ban30",
      "ban31",
      "ban32",
      "ban33",
      "ban34",
      "ban35",
      "ban36",
      "ban37",
      "ban38",
      "ban39",
      "ban40",
      "ban41",
      "ban42",
      "ban43",
      "ban44",
      "ban45",
      "ban46",
      "ban47",
      "ban48",
      "ban49",
    ];
    if (d.indexOf(a) >= 0) e = c[d.indexOf(a)];
    else e = "";

    return e;
  }
  function loc_m_1(a) {
    var b = [];
    for (var i = 0; i < a.length; i++) {
      if (a.length != 0) b.push(a[i].BAN);
    }
    return b;
  }
  function xoa_gia_tri_trung(arr) {
    return arr.filter((value, index, arr) => arr.indexOf(value) === index);
  }
  function mc(a, b) {
    var a1 = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) a1.push(a[i]);
    }
    a1 = xoa_gia_tri_trung(a1);
    return a1;
  }
  function loc_them_bo_luot(a, b, c) {
    var a1 = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) a1.push(a[i].BAN + c.indexOf(a[i].BAN + a[i].ID));
    }
    a1 = xoa_gia_tri_trung(a1);

    return a1;
  }

  function mang_t(a, b) {
    var c = [],
      c1 = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        if (c1.indexOf("!") < 0) {
          c.push(a[i].T_S1 + "!" + a[i].ID);
          c1.push("!");
        } else if (c1.indexOf("$") < 0) {
          c.push(a[i].T_S1 + "$" + a[i].ID);
          c1.push("$");
        } else if (c1.indexOf("^") < 0) {
          c.push(a[i].T_S1 + "^" + a[i].ID);
          c1.push("^");
        } else if (c1.indexOf("?") < 0) {
          c.push(a[i].T_S1 + "?" + a[i].ID);
          c1.push("?");
        }
      }
    }
    return c;
  }
  function mc1(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) dem++;
    }
    return dem;
  }
  function cap_nhat_mangUsers_thoat(a, b) {
    var d = [],
      e = [];
    for (var i = 0; i < a.length; i++) {
      d.push(a[i]);
    }

    if (d.findIndex((X) => X.BAN === b.BAN) >= 0) {
      a[d.findIndex((X) => X.BAN === b.BAN)] = b;
    } else {
      a.push(b);
    }

    return a;
  }
  function mc2(a, b, c) {
    var vt = 0;
    d = mc(a, b);
    for (var i = 0; i < d.length; i++) {
      if (d[i].BAN + d[i].ID == b + c) vt = i;
    }

    return vt;
  }

  /*function imgRandom(imgArr) {
        return imgArr[Math.floor(Math.random() * imgArr.length)];
    }*/
  function giaomang(a, b) {
    for (var i = 0; i < b.length; i++) {
      if (a.indexOf(b[i]) >= 0) {
        a.splice(a.indexOf(b[i]), 1);
      }
    }
    return a;
  }

  function toinhatuutienditruoc(a, b, c) {
    var k = "";
    if (a != []) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == c && b.findIndex((X) => X.ID === a[i].ID) < 0) {
          k = a[i].ID;
          break;
        }
      }
    }
    return k;
  }
  function loc_anh(a) {
    var b = [];
    var k = "";
    k = a[Math.floor(Math.random() * a.length)];
    b.push(k);
    for (var i = 0; i < 12; ) {
      if (b.indexOf(k) < 0) {
        b.push(k);
        i++;
      } else {
        k = a[Math.floor(Math.random() * a.length)];
      }
    }

    return b;
  }
  function sapxep(a) {
    var ppp = [];
    var tg;

    var i;
    var j;
    var j1, j2, j3, i1, i2, i3, t, t1, q1, q2;
    for (i = 0; i < a.length; i++) {
      for (j = i + 1; j < a.length; j++) {
        i1 = a[j].substring(4, 7); //16a
        i2 = i1.substring(0, 2);
        i3 = i1.substring(2);
        //////////////////////
        j1 = a[i].substring(4, 7); //16a
        j2 = j1.substring(0, 2);
        j3 = j1.substring(2);
        // alert(j2);

        if (i3 == "a") {
          t = 0.1;
        } else if (i3 == "b") {
          t = 0.2;
        } else if (i3 == "c") {
          //
          t = 0.3;
        } else if (i3 == "d") {
          t = 0.4;
        }
        //////////
        if (j3 == "a") {
          t1 = 0.1;
        } else if (j3 == "b") {
          t1 = 0.2;
        } else if (j3 == "c") {
          t1 = 0.3;
        } else if (j3 == "d") {
          t1 = 0.4;
        }

        q1 = parseInt(i2) + t;
        q2 = parseInt(j2) + t1;
        //alert(q1);
        if (q1 < q2) {
          //<------
          tg = a[i];
          a[i] = a[j];
          a[j] = tg;
        }
      }
    }
    for (j = 0; j < a.length; j++) {
      ppp.push(a[j]);
    }
    return ppp;
  }
  function allbantoinhat(a, b) {
    var c = [];

    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        c.push(a[i]);
      }
    }
    return c;
  }
  function d123(a) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      dem++;
    }
    return dem;
  }

  function demsoluongtoinhat(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        dem++;
      }
    }
    return dem;
  }
  function dem_songuoi_1(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) dem++;
    }
    return dem;
  }
  function tim_nguoi_dang_Danh(a, b) {
    var d = "";
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        d = a[i];
        break;
      }
    }
    return d;
  }
  function _m_c(a, b) {
    var a1 = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) a1.push(a[i].BAN + a[i].ID);
    }
    a1 = xoa_gia_tri_trung(a1);
    return a1;
  }
  function loc_luot_nuoc_di_ke_tiep(a, b, c) {
    var mangUsers2_loc = _m_c(a, c);
    var mangUsers3_loc = loc_them_bo_luot(b, c, mangUsers2_loc);
    var n = mc1(a, c);
    var d = [];
    ////////////////////////////////////////////////////////////////////////////////
    if (mangUsers2_loc.indexOf(c + socket.id) == 0) {
      //0 1 2
      t0 = 0;
      t1 = 1;
      t2 = 0;
      t3 = 0;
      if (n == 3) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      }
      if (n == 2) {
        //////0  1  2
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
    }
    if (mangUsers2_loc.indexOf(c + socket.id) == 1) {
      //0  1  2
      t0 = 0;
      t1 = 0;
      t2 = 1;
      t3 = 0;
      if (n == 3) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
      if (n == 2) {
        //////0  1
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0; //0 1 2
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
    }
    if (mangUsers2_loc.indexOf(c + socket.id) == 2) {
      //0 1 2
      t0 = 0;
      t1 = 0;
      t2 = 0;
      t3 = 1;
      if (n == 3) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      }
      if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0; //0 1 2
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 3 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
    }
    if (mangUsers2_loc.indexOf(c + socket.id) == 3) {
      //0 1 2
      t0 = 1;
      t1 = 0;
      t2 = 0;
      t3 = 0;

      if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      }
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) < 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 0;
        t3 = 1;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) < 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 1;
        t1 = 0;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) < 0 &&
        mangUsers3_loc.indexOf(c + 2) >= 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 1;
        t2 = 0;
        t3 = 0;
      } else if (
        n == 4 &&
        mangUsers3_loc.indexOf(c + 0) >= 0 &&
        mangUsers3_loc.indexOf(c + 1) >= 0 &&
        mangUsers3_loc.indexOf(c + 2) < 0 &&
        mangUsers3_loc.indexOf(c + 3) >= 0
      ) {
        t0 = 0;
        t1 = 0;
        t2 = 1;
        t3 = 0;
      }
    }
    d.push(t0);
    d.push(t1);
    d.push(t2);
    d.push(t3);
    return d;
  }
  /////////////////////////////////////////////////////////////////////////////ham xu ly
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  socket.on("client-send-ten-id-ban", function (data) {
    /////////user gui id va ten ban
    io.sockets.emit("server-send-id-ban-bai", mang_ten);
  });
  socket.on("client-send-ban", function (data) {
    /////////user gui id va ten ban
    ////////////////////////////////////////

    socket.ban = data.ban;
    mangUsers2.push(new Thong_Tin(socket.id, socket.ban));
    //var aaa=new Thong_Tin(socket.id,socket.ban);

    var o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-tat-ca-ban-so-nguoi", o_f);
    var mq = mc(mangUsers2, socket.ban);

    mang_ten.push(new Thong_Tin(socket.id, socket.ban, data.ten));
    io.sockets.emit("server-send-id-ban-bai", mang_ten);
    var mt1 = mang_t(mang_ten, socket.ban);

    //var o_f = new On_Off(mang_luu_trang_thai_choi,mangUsers2,mang_thoat_game);
    io.sockets.emit("server-send-banday", o_f);
    if (mq.length == 1) {
      io.to(mq[0].ID).emit("server-send-vitri", "12" + mt1[0] + "#" + "");
    } else if (mq.length == 2) {
      io.to(mq[0].ID).emit("server-send-vitri", "12" + mt1[0] + "#" + mt1[1]);
      io.to(mq[1].ID).emit("server-send-vitri", "22" + mt1[1] + "#" + mt1[0]);
    } else if (mq.length == 3) {
      io.to(mq[0].ID).emit(
        "server-send-vitri",
        "13" + mt1[0] + "#" + mt1[1] + "@" + mt1[2]
      );
      io.to(mq[1].ID).emit(
        "server-send-vitri",
        "23" + mt1[1] + "#" + mt1[2] + "@" + mt1[0]
      );
      io.to(mq[2].ID).emit(
        "server-send-vitri",
        "33" + mt1[2] + "#" + mt1[0] + "@" + mt1[1]
      );
    } else if (mq.length == 4) {
      io.to(mq[0].ID).emit(
        "server-send-vitri",
        "14" + mt1[0] + "#" + mt1[1] + "@" + mt1[2] + "%" + mt1[3]
      );
      io.to(mq[1].ID).emit(
        "server-send-vitri",
        "24" + mt1[1] + "#" + mt1[2] + "@" + mt1[3] + "%" + mt1[0]
      );
      io.to(mq[2].ID).emit(
        "server-send-vitri",
        "34" + mt1[2] + "#" + mt1[3] + "@" + mt1[0] + "%" + mt1[1]
      );
      io.to(mq[3].ID).emit(
        "server-send-vitri",
        "44" + mt1[3] + "#" + mt1[0] + "@" + mt1[1] + "%" + mt1[2]
      );
    }
  });
  socket.on("user-send-ten-ban-tam-thoi", function (data) {
    //mang_ten1.push(data+"@"+socket.id);
    mang_ten1.push(new Thong_Tin(socket.id, data.ban, data.ten));
    var mq = mc(mangUsers2, data.ban);

    var mt1 = mang_t(mang_ten, data.ban);

    var o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-banday", o_f);
    /*if(mq.length==2)
	  {		 
			 io.to(mq[0].ID).emit("server-send-vitri","12"+mt1[0]+"#"+mt1[1]);
			 io.to(mq[1].ID).emit("server-send-vitri","22"+mt1[1]+"#"+mt1[0]);
				 
	  }
	  else if(mq.length==3)
	  {	
		     io.to(mq[0].ID).emit("server-send-vitri","13"+mt1[0]+"#"+mt1[1]+"@"+mt1[2]);
		     io.to(mq[1].ID).emit("server-send-vitri","23"+mt1[1]+"#"+mt1[2]+"@"+mt1[0]);
			 io.to(mq[2].ID).emit("server-send-vitri","33"+mt1[2]+"#"+mt1[0]+"@"+mt1[1]);	
			
	  }
	  else if(mq.length==4)
	  {
	
		      io.to(mq[0].ID).emit("server-send-vitri","14"+mt1[0]+"#"+mt1[1]+"@"+mt1[2]+"%"+mt1[3]);
		      io.to(mq[1].ID).emit("server-send-vitri","24"+mt1[1]+"#"+mt1[2]+"@"+mt1[3]+"%"+mt1[0]);
			  io.to(mq[2].ID).emit("server-send-vitri","34"+mt1[2]+"#"+mt1[3]+"@"+mt1[0]+"%"+mt1[1]);
			  io.to(mq[3].ID).emit("server-send-vitri","44"+mt1[3]+"#"+mt1[0]+"@"+mt1[1]+"%"+mt1[2]);					  
	  }*/
  });
  socket.on("user-send-on-off-trang-thai", function (data) {
    var o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-on-off-trang-thai", o_f);
  });
  socket.on("user-send-ban", function (data) {
    socket.join(data);
    socket.ban1 = data;
    io.sockets.in(socket.ban1).emit("server-send-join-ban");

    //io.sockets.emit("server-send-ktra-ban-co-bao-nhieu-nguoi",mangUsers2);
    if (parseInt(data.substring(5, 3)) > 49) {
      if (mangUsers_chat != "") {
        for (var i = 0; i < mangUsers_chat.length; i++) {
          io.sockets
            .in(socket.ban1)
            .emit("server-send-nd-chat", mangUsers_chat);
          io.sockets
            .in(socket.ban1)
            .emit("server-send-nd-chat", mangUsers_chat);
        }
      }

      mangUsers_ban_tam.push(new Thong_Tin(socket.id, socket.ban1));

      var ten_socket_ban = chuyen_ban_nho(socket.ban1);

      var mq = dem_songuoi_1(mangUsers2, ten_socket_ban);

      var mt1 = mang_t(mang_ten, ten_socket_ban);

      var mct2 = tim_nguoi_dang_Danh(mangUsers_thoat, ten_socket_ban);
      ////////////////////////////////////////

      io.sockets
        .in(socket.ban1)
        .emit(
          "server-send-danh-sach-ten-tam",
          loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
        );
      io.sockets
        .in(chuyen_ban_nho(socket.ban1))
        .emit(
          "server-send-danh-sach-ten-tam",
          loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
        );

      if (mq == 2) {
        mangUsers2_loc = mc(mangUsers2, ten_socket_ban);
        io.sockets
          .in(socket.ban1)
          .emit("server-send-vitri", "12" + mt1[0] + "#" + mt1[1]);

        if (mangUsers2_loc.indexOf(mct2) == 0) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 1);
          // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[0].ID);
        } else if (mangUsers2_loc.indexOf(mct2) == 1) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 2);
          // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
        }
      } else if (mq == 3) {
        mangUsers2_loc = mc(mangUsers2, ten_socket_ban);
        io.sockets
          .in(socket.ban1)
          .emit(
            "server-send-vitri",
            "13" + mt1[0] + "#" + mt1[1] + "@" + mt1[2]
          );

        if (mangUsers2_loc.indexOf(mct2) == 0) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 1);
          //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[0].ID);
        } else if (mangUsers2_loc.indexOf(mct2) == 1) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 2);
          // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
        } else if (mangUsers2_loc.indexOf(mct2) == 2) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 3);
          // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[2].ID);
        }
      } else if (mq == 4) {
        mangUsers2_loc = mc(mangUsers2, ten_socket_ban);
        io.sockets
          .in(socket.ban1)
          .emit(
            "server-send-vitri",
            "14" + mt1[0] + "#" + mt1[1] + "@" + mt1[2] + "%" + mt1[3]
          );
        if (mangUsers2_loc.indexOf(mct2) == 0) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 1);
        } else if (mangUsers2_loc.indexOf(mct2) == 1) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 2);
        } else if (mangUsers2_loc.indexOf(mct2) == 2) {
          io.sockets.in(socket.ban1).emit("server-send-mau", 3);
        } else if (mangUsers2_loc.indexOf(mct2) == 3)
          io.sockets.in(socket.ban1).emit("server-send-mau", 4);
      }
    } else {
      if (mangUsers_chat != "") {
        for (var i = 0; i < mangUsers_chat.length; i++) {
          io.sockets
            .in(socket.ban1)
            .emit("server-send-nd-chat", mangUsers_chat);
        }
      }
    }
  });
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  socket.on("user-send-dong-ho-id", function (data) {
    io.sockets.in(socket.ban1).emit("server-send-dong-ho-id", data);
  });
  socket.on("user-send-batdau", function (data) {
    var mangUsers2_loc = mc(mangUsers2, socket.ban);
    // io.sockets.in(socket.ban1).emit("server-send-mesage", {nd:data});
    io.to(mangUsers2_loc[0].ID).emit("server-send-batdau");
  });

  socket.on("user-send-tat-ca-ban-so-nguoi-choi", function (data) {
    if (mangUsers2 != "") {
      var o_f = new On_Off(
        mang_luu_trang_thai_choi,
        mangUsers2,
        mang_thoat_game
      );
      io.sockets.emit("server-send-tat-ca-ban-so-nguoi", o_f);
    }
  });

  socket.on("user-send-ban-dang-dau-hay-cho", function (data) {
    function chuyen_ban_lon(a) {
      var c = "",
        d = [
          "ban50",
          "ban51",
          "ban52",
          "ban53",
          "ban54",
          "ban55",
          "ban56",
          "ban57",
          "ban58",
          "ban59",
          "ban60",
          "ban61",
          "ban62",
          "ban63",
          "ban64",
          "ban65",
          "ban66",
          "ban67",
          "ban68",
          "ban69",
          "ban70",
          "ban71",
          "ban72",
          "ban73",
          "ban74",
          "ban75",
          "ban76",
          "ban77",
          "ban78",
          "ban79",
          "ban80",
          "ban81",
          "ban82",
          "ban83",
          "ban84",
          "ban85",
          "ban86",
          "ban87",
          "ban88",
          "ban89",
          "ban90",
          "ban91",
          "ban92",
          "ban93",
          "ban94",
          "ban95",
          "ban96",
          "ban97",
          "ban98",
          "ban99",
        ];
      c = d[parseInt(a.substring(5, 3))];

      return c;
    }
    function xem_ban_da_du_chua(a, b) {
      var dem = 0;
      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) {
          dem++;
        }
      }

      return dem;
    }

    var x_b = xem_ban_da_du_chua(mangUsers_ket_thuc_van, data);

    if (x_b > 1) {
      socket.emit("server-send-ket-qua-dau-hay-cho", chuyen_ban_lon(data));
    } else {
      socket.emit("server-send-ket-qua-dau-hay-cho", "");
    }
  });
  socket.on("user-send-ban-dang-dau-hay-cho-2", function () {
    socket.emit("server-send-ket-qua-dau-hay-cho-2", mangUsers_ket_thuc_van);
  });
  socket.on("user-send-ket-thuc-van", function () {
    function loc_ket_thuc(a) {
      var c = [];
      for (var i = 0; i < a.length; i++) {
        c.push(a[i].BAN);
      }
      return c;
    }
    function dem_ket_thuc(a, b) {
      var dem = 0;
      for (var i = 0; i < a.length; i++) {
        if (a[i] == b) dem++;
      }
      return dem;
    }

    for (var i = 0; i < mangUsers_ket_thuc_van.length; i++) {
      if (mangUsers_ket_thuc_van[i] == socket.ban1 + socket.id) {
        mangUsers_ket_thuc_van.splice(i, 1);
      }
    }
    var loc = loc_ket_thuc(mangUsers_ket_thuc_van);
    var dem = dem_ket_thuc(loc, socket.ban1);
    for (var i = 0; i < mangUsers_ket_thuc_van.length; i++) {
      if (dem == 1) {
        if (mangUsers_ket_thuc_van[i].BAN == socket.ban1) {
          mangUsers_ket_thuc_van.splice(i, 1);
        }
      }
    }
  });
  socket.on("user-send-xem-van-dau", function (data) {
    function xem_ban_dau(a, b, d) {
      var c = [];
      for (var i = 0; i < a.length; i++) {
        c.push(a[i]);
      }
      for (var i = 0; i < d.length; i++) {
        if (c.indexOf(d[i]) < 0) c.push(d[i]);
      }

      return c;
    }
    var mangUsers2_loc = mc(mangUsers2, socket.ban1);
    if (data == 1) {
      mangUsers_ket_thuc_van = xem_ban_dau(
        mangUsers_ket_thuc_van,
        socket.ban1 + socket.id,
        mangUsers2_loc
      );
    }
    //io.sockets.emit("server-send-ket-qua-xet-ban");
    io.sockets.emit(
      "server-send-ket-qua-dau-hay-cho-2",
      mangUsers_ket_thuc_van
    );
  });
  socket.on("user-send-chat-nd-1", function (data) {
    mangUsers_chat.push(new Thong_Tin(socket.id, data.ban, data.ten, data.nd));
    var ban = data.ban;
    if (parseInt(ban.substring(3)) > 49) {
      //console.log(ban);
      io.sockets.in(ban).emit("server-send-nd-chat", mangUsers_chat);
      io.sockets
        .in(chuyen_ban_nho(ban))
        .emit("server-send-nd-chat", mangUsers_chat);
    } else {
      io.sockets
        .in(chuyen_ban_lon(ban))
        .emit("server-send-nd-chat", mangUsers_chat);
      io.sockets.in(ban).emit("server-send-nd-chat", mangUsers_chat);
    }
  });
  socket.on("user-send-bai-con-lai", function (data) {
    mang_bai_con_lai = loc_bai_con_lai(
      mang_bai_con_lai,
      socket.id,
      socket.ban1,
      data
    );
    var mangUsers2_loc = mc(mangUsers2, socket.ban1);
    var mt1 = mang_t(mang_ten, socket.ban1);
    ///////////////////////////////////
    function _loc_mang_con_lai_(a, b) {
      var dem = 0;

      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b && a[i].T_S1 != "") {
          dem++;
        }
      }

      return dem;
    }

    var mang_bai_con_lai_loc_22 = mc_k(mang_bai_con_lai, mang_ten, socket.ban1);

    var bai = new Bai_Con(mang_bai_con_lai_loc_22, mangUsers2_loc);

    io.sockets
      .in(socket.ban1)
      .emit("server-send-so-luong-bai-con-lai-show", bai);
    io.sockets
      .in(chuyen_ban_lon(socket.ban1))
      .emit("server-send-so-luong-bai-con-lai-show", bai);

    ////////////////////////////////////

    var d1 = _xem_nguoi_tiep_tuc_danh(mangUsers2, mang_thoat_game, socket.ban1);

    if (_loc_mang_con_lai_(mang_bai_con_lai, socket.ban1) == 1) {
      var k = [];
      k = loc_mang_gia_tri_con_lai(mang_bai_con_lai, socket.ban1);

      var k5 = loc_mang_gia_tri_con_lai_2(mang_bai_con_lai, socket.ban1);
      io.to(k5.ID).emit("server-send-thua-bet");
      io.sockets.in(socket.ban1).emit("server-send-bai-thua-cuoi", k); //
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-bai-thua-cuoi", k); //

      io.to(d1).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
      //io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-nhan-ban-full", "1");
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      //mangUsers2=giao_mang_xoa(mangUsers2,mang_thoat_game);

      var o_f = new On_Off(
        mang_luu_trang_thai_choi,
        mangUsers2,
        mang_thoat_game
      );
      //var d8=_giao_mang_nguoi_choi_vs(mangUsers2,mang_thoat_game,socket.ban,1);
      //var d9=_giao_mang_nguoi_choi_vs(mangUsers2,mang_thoat_game,socket.ban,2);
      //io.sockets.emit("server-send-ktra-ban-co-bao-nhieu-nguoi",d8);
      io.sockets.emit("server-send-tat-ca-ban-so-nguoi", o_f);
      io.sockets.emit("server-send-banday", o_f);
      // io.sockets.emit("server-send-ktra-ban-dang-danh11",d9);
      for (var i = 0; i < listMessages.length; ) {
        if (listMessages[i].BAN == socket.ban1) {
          listMessages.splice(i, 1);
        } else {
          i++;
        }
      }
      mang_bai_con_lai = _giao_2_mang_trung_p_t(
        mang_bai_con_lai,
        mang_thoat_game,
        socket.ban1
      );

      mang_gia_tri_thang = _giao_2_mang_trung_p_t(
        mang_gia_tri_thang,
        mang_thoat_game
      );

      mangUsers3 = _giao_2_mang_trung_p_t(mangUsers3, mang_thoat_game);

      mang_gia_tri_huong_sai = _giao_2_mang_trung_p_t(
        mang_gia_tri_huong_sai,
        mang_thoat_game
      );

      //////////////////////moi

      mangUsers_thoat = _giao_2_mang_trung_p_t(
        mangUsers_thoat,
        mang_thoat_game
      );

      mang_ten = _giao_2_mang_trung_p_t(mang_ten, mang_thoat_game);

      mang_ten1 = _giao_2_mang_trung_p_t(mang_ten1, mang_thoat_game);

      mangUsers_ket_thuc_van = _giao_2_mang_trung_p_t(
        mangUsers_ket_thuc_van,
        mang_thoat_game
      );

      mangUsers_ban_tam = _giao_2_mang_trung_p_t(
        mangUsers_ban_tam,
        mang_thoat_game
      );

      for (var i = 0; i < mangUsers_trang_thai_ban_tam1.length; ) {
        if (mangUsers_trang_thai_ban_tam1[i].BAN == socket.ban1) {
          mangUsers_trang_thai_ban_tam1.splice(i, 1);
        } else {
          i++;
        }
      }

      mang_tam = _giao_2_mang_trung_p_t(mang_tam, mang_thoat_game);

      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      mangUsers2 = _giao_2_mang_trung_p_t(mangUsers2, mang_thoat_game);

      for (var i = 0; i < mang_thoat_game.length; ) {
        if (mang_thoat_game[i].BAN == socket.ban1) {
          mang_thoat_game.splice(i, 1);
        } else {
          i++;
        }
      }
    }

    o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-on-off-trang-thai", o_f);
  });

  socket.on("user-send-phatbai", function (data) {
    for (var i = 0; i < mang_luu_trang_thai_choi.length; i++) {
      if (
        mang_luu_trang_thai_choi[i].T_S1 == "on" &&
        mang_luu_trang_thai_choi[i].BAN == socket.ban1
      ) {
        mang_luu_trang_thai_choi.push(new Thong_Tin("?", socket.ban1, "off"));
        break;
      }
    }

    io.sockets.in(socket.ban1).emit("server-send-BatDauGame");
    io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-BatDauGame");

    for (
      var i = 0;
      i < mangUsers2.length; //

    ) {
      if (
        mangUsers2[i].BAN == socket.ban1 &&
        mang_thoat_game.findIndex((x) => x.ID === mangUsers2[i].ID) >= 0
      ) {
        mangUsers2.splice(i, 1);
      } else {
        i++;
      }
    }

    mangUsers_trang_thai_ban = trang_thai_ban_them(
      mangUsers_trang_thai_ban,
      socket.ban1
    );

    io.sockets.emit(
      "server-so-nguoi-full",
      chuyen_chuoi_ve_mang(
        mangUsers_trang_thai_ban,
        dem_nguoichoi_ban_b_n(mangUsers2, socket.ban1),
        socket.ban1
      )
    );
    io.sockets
      .in(chuyen_ban_lon(socket.ban1))
      .emit("server-send-nhan-ban-full", "");
    mangUsers_trang_thai_ban_tam1 = chuyen_chuoi_ve_mang(
      mangUsers_trang_thai_ban,
      dem_nguoichoi_ban_b_n(mangUsers2, socket.ban1),
      socket.ban1
    );

    var count = io.sockets.adapter.rooms[socket.ban1].length;

    if (count >= 2 && count <= 4) {
      var mangUsers2_loc = mc(mangUsers2, socket.ban);
      var img = [
        "anh/03a.png",
        "anh/03b.png",
        "anh/03c.png",
        "anh/03d.png",
        "anh/04a.png",
        "anh/04b.png",
        "anh/04c.png",
        "anh/04d.png",
        "anh/05a.png",
        "anh/05b.png",
        "anh/05c.png",
        "anh/05d.png",
        "anh/06a.png",
        "anh/06b.png",
        "anh/06c.png",
        "anh/06d.png",
        "anh/07a.png",
        "anh/07b.png",
        "anh/07c.png",
        "anh/07d.png",
        "anh/08a.png",
        "anh/08b.png",
        "anh/08c.png",
        "anh/08d.png",
        "anh/09a.png",
        "anh/09b.png",
        "anh/09c.png",
        "anh/09d.png",
        "anh/10a.png",
        "anh/10b.png",
        "anh/10c.png",
        "anh/10d.png",
        "anh/11a.png",
        "anh/11b.png",
        "anh/11c.png",
        "anh/11d.png",
        "anh/12a.png",
        "anh/12b.png",
        "anh/12c.png",
        "anh/12d.png",
        "anh/13a.png",
        "anh/13b.png",
        "anh/13c.png",
        "anh/13d.png",
        "anh/14a.png",
        "anh/14b.png",
        "anh/14c.png",
        "anh/14d.png",
        "anh/16a.png",
        "anh/16b.png",
        "anh/16c.png",
        "anh/16d.png",
      ];
      var m1 = [];
      var m2 = [];
      var m3 = [];
      var m4 = [];
      var x1 = loc_anh(img);
      var y1 = giaomang(img, x1);
      var x2 = loc_anh(y1);
      var y2 = giaomang(y1, x2);
      var x3 = loc_anh(y2);
      var y3 = giaomang(y2, x3);
      var dem = d123(mangUsers2_loc);
      var d1 = _xem_nguoi_tiep_tuc_danh(
        mangUsers2,
        mang_thoat_game,
        socket.ban1
      );

      ////////////////////////////////////////
      m1 = sapxep(x1);
      m2 = sapxep(x2);
      m3 = sapxep(x3);
      m4 = sapxep(y3);
      /*m1=["anh/03a.png", "anh/04b.png","anh/05a.png"];
		
		m2=["anh/04a.png", "anh/05b.png", "anh/06a.png"];
		m3=["anh/06b.png", "anh/07d.png","anh/08c.png"];
		m4=["anh/09a.png","anh/10b.png", "anh/11c.png"];*/

      ///////////////////////////////////////
      function mang_gia_tri_thang_l_full(a, b) {
        var k = 0;
        if (a != []) {
          for (var i = 0; i < a.length; i++) {
            if (a[i].BAN == b) {
              k = 1;
              break;
            }
          }
        }
        return k;
      }

      io.sockets.in(socket.ban1).emit("server-send-phatbai1", "0");
      var mq = mc(mangUsers2, socket.ban1);

      var mt1 = mang_t(mang_ten, socket.ban1);

      ////////////////////////////////////////

      if (mq.length == 2) {
        io.to(mq[0].ID).emit("server-send-vitri", "12" + mt1[0] + "#" + mt1[1]);
        io.to(mq[1].ID).emit("server-send-vitri", "22" + mt1[1] + "#" + mt1[0]);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-vitri", "12" + mt1[0] + "#" + mt1[1]);
        //console.log(mangUsers2);
      } else if (mq.length == 3) {
        io.to(mq[0].ID).emit(
          "server-send-vitri",
          "13" + mt1[0] + "#" + mt1[1] + "@" + mt1[2]
        );
        io.to(mq[1].ID).emit(
          "server-send-vitri",
          "23" + mt1[1] + "#" + mt1[2] + "@" + mt1[0]
        );
        io.to(mq[2].ID).emit(
          "server-send-vitri",
          "33" + mt1[2] + "#" + mt1[0] + "@" + mt1[1]
        );
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit(
            "server-send-vitri",
            "13" + mt1[0] + "#" + mt1[1] + "@" + mt1[2]
          );
      } else if (mq.length == 4) {
        io.to(mq[0].ID).emit(
          "server-send-vitri",
          "14" + mt1[0] + "#" + mt1[1] + "@" + mt1[2] + "%" + mt1[3]
        );
        io.to(mq[1].ID).emit(
          "server-send-vitri",
          "24" + mt1[1] + "#" + mt1[2] + "@" + mt1[3] + "%" + mt1[0]
        );
        io.to(mq[2].ID).emit(
          "server-send-vitri",
          "34" + mt1[2] + "#" + mt1[3] + "@" + mt1[0] + "%" + mt1[1]
        );
        io.to(mq[3].ID).emit(
          "server-send-vitri",
          "44" + mt1[3] + "#" + mt1[0] + "@" + mt1[1] + "%" + mt1[2]
        );
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit(
            "server-send-vitri",
            "14" + mt1[0] + "#" + mt1[1] + "@" + mt1[2] + "%" + mt1[3]
          );
      }
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-xoa-list-ban-tam");
      if (dem == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-phatbai", m1);
        io.to(mangUsers2_loc[1].ID).emit("server-send-phatbai", m2);
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[0].ID,
          mangUsers2_loc[0].BAN,
          m1
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[1].ID,
          mangUsers2_loc[1].BAN,
          m2
        );
      } else if (dem == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-phatbai", m1);
        io.to(mangUsers2_loc[1].ID).emit("server-send-phatbai", m2);
        io.to(mangUsers2_loc[2].ID).emit("server-send-phatbai", m3);
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[0].ID,
          mangUsers2_loc[0].BAN,
          m1
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[1].ID,
          mangUsers2_loc[1].BAN,
          m2
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[2].ID,
          mangUsers2_loc[2].BAN,
          m3
        );
      } else if (dem == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-phatbai", m1);
        io.to(mangUsers2_loc[1].ID).emit("server-send-phatbai", m2);
        io.to(mangUsers2_loc[2].ID).emit("server-send-phatbai", m3);
        io.to(mangUsers2_loc[3].ID).emit("server-send-phatbai", m4);
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[0].ID,
          mangUsers2_loc[0].BAN,
          m1
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[1].ID,
          mangUsers2_loc[1].BAN,
          m2
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[2].ID,
          mangUsers2_loc[2].BAN,
          m3
        );
        mang_bai_con_lai = loc_bai_con_lai(
          mang_bai_con_lai,
          mangUsers2_loc[3].ID,
          mangUsers2_loc[3].BAN,
          m4
        );
      }
      var mang_bai_con_lai_loc_22 = mc_k(
        mang_bai_con_lai,
        mang_ten,
        socket.ban1
      );

      var bai = new Bai_Con(mang_bai_con_lai_loc_22, mangUsers2_loc);

      io.sockets
        .in(socket.ban1)
        .emit("server-send-so-luong-bai-con-lai-show", bai);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-so-luong-bai-con-lai-show", bai);
      if (mang_gia_tri_thang_l_full(mang_gia_tri_thang, socket.ban1) == 1) {
        var lyt = toinhatuutienditruoc(
          mang_gia_tri_thang,
          mang_thoat_game,
          socket.ban1
        );
        io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-rest-dong-ho-id");
        io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2", lyt);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-dong-ho-id-2", lyt);
        io.to(lyt).emit("server-send-phatbai1", "1");
        io.to(lyt).emit("server-send-mesage1", "1");
        io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2", lyt);
        var lt = mc2(mangUsers2, socket.ban1, lyt);

        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
        io.sockets.in(socket.ban1).emit("server-send-mau", lt + 1);

        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 1);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 2);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 3);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 4);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-mau", lt + 1);
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2[lt]
        );
        //var vtthang= mangUsers2.indexOf(socket.ban1+socket.id);
      } else {
        io.sockets.in(socket.ban1).emit("server-send-phatbai1", "0");
        io.to(d1).emit("server-send-phatbai1", "1"); //d1
        io.sockets.in(socket.ban1).emit("server-send-mau", 1);
        io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-rest-dong-ho-id");
        io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2", d1);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-dong-ho-id-2", d1);
        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 1);
      }
      io.sockets.in(socket.ban1).emit("server-send-phatbai-listMessages", "0");
    } else {
      //////////io.to(socket.id).emit("server-send-khong-phatbai","0");//////
    }
    if (data == "batdau" && count > 1) {
      var lyt = toinhatuutienditruoc(mangUsers2, mang_thoat_game, socket.ban1);
      io.to(lyt).emit("server-send-mesage1", "1");
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
      io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2", lyt);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-dong-ho-id-2", lyt);
      io.sockets.in(socket.ban1).emit("server-send-mau", 1);
      io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 1);
      mangUsers_thoat = cap_nhat_mangUsers_thoat(
        mangUsers_thoat,
        mangUsers2_loc[0]
      );
    }
    mang_luu_trang_thai_choi = _luu_on_off_user(
      mang_luu_trang_thai_choi,
      socket.ban1,
      "on"
    );

    o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-on-off-trang-thai", o_f);

    for (var i = 0; i < mang_gia_tri_thang.length; ) {
      if (mang_gia_tri_thang[i].BAN == socket.ban1) {
        mang_gia_tri_thang.splice(i, 1);
      } else {
        i++;
      }
    }

    /////////////////////////

    mang_bai_con_lai = _giao_2_mang_trung_p_t(
      mang_bai_con_lai,
      mang_thoat_game
    );

    mang_gia_tri_thang = _giao_2_mang_trung_p_t(
      mang_gia_tri_thang,
      mang_thoat_game
    );

    for (var i = 0; i < mangUsers3.length; ) {
      if (mangUsers3[i].BAN == socket.ban1) {
        mangUsers3.splice(i, 1);
      } else {
        i++;
      }
    }

    for (var i = 0; i < listMessages.length; ) {
      if (listMessages[i].BAN == socket.ban1) {
        listMessages.splice(i, 1);
      } else {
        i++;
      }
    }
    mang_gia_tri_huong_sai = _giao_2_mang_trung_p_t(
      mang_gia_tri_huong_sai,
      mang_thoat_game
    );

    //////////////////////moi

    mangUsers_thoat = _giao_2_mang_trung_p_t(mangUsers_thoat, mang_thoat_game);

    mang_ten = _giao_2_mang_trung_p_t(mang_ten, mang_thoat_game);

    mang_ten1 = _giao_2_mang_trung_p_t(mang_ten1, mang_thoat_game);

    mangUsers_ket_thuc_van = _giao_2_mang_trung_p_t(
      mangUsers_ket_thuc_van,
      mang_thoat_game
    );

    mangUsers_ban_tam = _giao_2_mang_trung_p_t(
      mangUsers_ban_tam,
      mang_thoat_game
    );

    /*if(mangUsers_trang_thai_ban!=[]){//['ban00']
										for(var i=0;i<mangUsers_trang_thai_ban.length;){
											if(mangUsers_trang_thai_ban[i]==socket.ban1){
											 mangUsers_trang_thai_ban.splice(i, 1);
											}else{
													  i++;
												  }
										 }
									}*/

    for (var i = 0; i < mangUsers_trang_thai_ban_tam1.length; ) {
      if (mangUsers_trang_thai_ban_tam1[i].BAN == socket.ban1) {
        mangUsers_trang_thai_ban_tam1.splice(i, 1);
      } else {
        i++;
      }
    }

    /*if(mangUsers_chat!=[]){//['ban00tt@ok nhanh len!' ]
										for(var i=0;i<mangUsers_chat.length;){
											if(mangUsers_chat[i].BAN==socket.ban1){
											 mangUsers_chat.splice(i, 1);
											}else{
													  i++;
												  }
										 }
									}*/

    mang_tam = _giao_2_mang_trung_p_t(mang_tam, mang_thoat_game);

    //['ban00off']
    mang_luu_trang_thai_choi = _luu_on_off_user(
      mang_luu_trang_thai_choi,
      socket.ban1,
      "on"
    );
    mangUsers2 = _giao_2_mang_trung_p_t(mangUsers2, mang_thoat_game);

    for (var i = 0; i < mang_thoat_game.length; ) {
      if (mang_thoat_game[i].BAN == socket.ban1) {
        mang_thoat_game.splice(i, 1);
      } else {
        i++;
      }
    }
    var mk = mc(mangUsers2, socket.ban1);

    var doi1 = [];
    var doi_thong1 = [];
    var doi2 = [];
    var doi_thong2 = [];
    var doi3 = [];
    var doi_thong3 = [];
    var doi0 = [];
    var doi_thong0 = [];
    var heo40 = [];
    var heo41 = [];
    var heo42 = [];
    var heo43 = [];
    var sanh0 = [];
    var sanh1 = [];
    var sanh2 = [];
    var sanh3 = [];
    if (mk.length == 2) {
      doi1 = AIktra_doi(m2);
      doi_thong1 = AIktra_doithong(doi1);

      doi0 = AIktra_doi(m1);
      doi_thong0 = AIktra_doithong(doi0);
      heo40 = ktra_4_heo(m1);
      heo41 = ktra_4_heo(m2);

      sanh0 = AIktra_sanh(m1);
      sanh1 = AIktra_sanh(m2);
    } else if (mk.length == 3) {
      doi1 = AIktra_doi(m2);
      doi_thong1 = AIktra_doithong(doi1);
      doi2 = AIktra_doi(m3);
      doi_thong2 = AIktra_doithong(doi2);

      doi0 = AIktra_doi(m1);
      doi_thong0 = AIktra_doithong(doi0);
      heo40 = ktra_4_heo(m1);
      heo41 = ktra_4_heo(m2);
      heo42 = ktra_4_heo(m3);

      sanh0 = AIktra_sanh(m1);
      sanh1 = AIktra_sanh(m2);
      sanh2 = AIktra_sanh(m3);
    } else if (mk.length == 4) {
      doi1 = AIktra_doi(m2);
      doi_thong1 = AIktra_doithong(doi1);
      doi2 = AIktra_doi(m3);
      doi_thong2 = AIktra_doithong(doi2);
      doi3 = AIktra_doi(m4);
      doi_thong3 = AIktra_doithong(doi3);
      doi0 = AIktra_doi(m1);
      doi_thong0 = AIktra_doithong(doi0);
      heo40 = ktra_4_heo(m1);
      heo41 = ktra_4_heo(m2);
      heo42 = ktra_4_heo(m3);
      heo43 = ktra_4_heo(m4);
      sanh0 = AIktra_sanh(m1);
      sanh1 = AIktra_sanh(m2);
      sanh2 = AIktra_sanh(m3);
      sanh3 = AIktra_sanh(m4);
    }
    if (doi0.length == 12) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[0].ID).emit("server-send-toi-trang");

      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi0);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi0);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (doi1.length == 12) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[1].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi1);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi1);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (doi2.length == 12) {
      if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[2].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi2);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi2);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (doi3.length == 12) {
      if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[3].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi3);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi3);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong0) == "6doithong") {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[0].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong0);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong0);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong1) == "6doithong") {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[1].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong1);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong1);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong2) == "6doithong") {
      if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[2].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong2);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong2);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong3) == "6doithong") {
      if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[3].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong3);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong3);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong0) == "5doithong") {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[0].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong0);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong0);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong1) == "5doithong") {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[1].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong1);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong1);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong2) == "5doithong") {
      if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[2].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong2);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong2);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (kiemtrahople(doi_thong3) == "5doithong") {
      if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[3].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", doi_thong3);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", doi_thong3);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (heo40.length == 4) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[0].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", heo40);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", heo40);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (heo41.length == 4) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[1].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", heo41);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", heo41);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (heo42.length == 4) {
      if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[2].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", heo42);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", heo42);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (heo43.length == 4) {
      if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[3].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", heo43);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", heo43);
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (sanh0.length == 12) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }

      io.to(mangUsers2_loc[0].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", sanh0);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", sanh0);
      io.sockets.in(socket.ban1).emit("server-send-rong-vang");
      io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-rong-vang");
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (sanh1.length == 12) {
      if (mangUsers2_loc.length == 2) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[1].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", sanh1);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", sanh1);
      io.sockets.in(socket.ban1).emit("server-send-rong-vang");
      io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-rong-vang");
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (sanh2.length == 12) {
      if (mangUsers2_loc.length == 3) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      } else if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[3].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[2].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", sanh2);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", sanh2);
      io.sockets.in(socket.ban1).emit("server-send-rong-vang");
      io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-rong-vang");
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    } else if (sanh3.length == 12) {
      if (mangUsers2_loc.length == 4) {
        io.to(mangUsers2_loc[1].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[2].ID).emit("server-send-thua-bet-bet");
        io.to(mangUsers2_loc[0].ID).emit("server-send-thua-bet-bet");
      }
      io.to(mangUsers2_loc[3].ID).emit("server-send-toi-trang");
      io.sockets.in(socket.ban1).emit("server-send-xoa-a");
      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
      io.to(mangUsers2_loc[0].ID).emit("server-send-tiep-tuc-danh", "1");
      io.sockets.in(socket.ban1).emit("server-send-mesage", sanh3);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-mesage", sanh3);
      io.sockets.in(socket.ban1).emit("server-send-rong-vang");
      io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-rong-vang");
      mang_luu_trang_thai_choi = _luu_on_off_user(
        mang_luu_trang_thai_choi,
        socket.ban1,
        "off"
      );
      io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-rest-dong-ho-id");
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////
  socket.on("user-send-ktra-ban-co-bao-nhieu-nguoi", function (data) {
    io.sockets.emit("server-send-ktra-ban-co-bao-nhieu-nguoi", mangUsers2);
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////
  socket.on("user-send-het-bai-toi", function (data) {
    if (data == "") {
      var _k_ = mc(mang_gia_tri_thang, socket.ban1);
      if (_k_.length == 0) {
        socket.emit("server-send-thang-1");
      } else if (_k_.length == 1) {
        socket.emit("server-send-thang-2");
      } else if (_k_.length == 2) {
        socket.emit("server-send-thang-3");
      }
      if (mangUsers3.findIndex((x) => x.ID === socket.id) < 0) {
        mangUsers3.push(new Thong_Tin(socket.id, socket.ban));
      }
      if (mang_gia_tri_thang.findIndex((x) => x.ID === socket.id) < 0) {
        mang_gia_tri_thang.push(new Thong_Tin(socket.id, socket.ban));
      }

      //var mang_gia_tri_thang_1ban=mc(mang_gia_tri_thang,socket.ban1);
      var mang_user_1ban = mc(mangUsers2, socket.ban1);
      var t1 = mang_user_1ban.findIndex((i) => i.ID === socket.id);
      if (mang_user_1ban.length == 3) {
        if (t1 == 0) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[1].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[2]
            );
          } else {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[1]
            );
          }
        } else if (t1 == 1) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[2].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[0]
            );
          } else {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[2]
            );
          }
        } else if (t1 == 2) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[0].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[1]
            );
          } else {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[0]
            );
          }
        }
      } else if (mang_user_1ban.length == 4) {
        if (t1 == 0) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[1].ID
            ) >= 0 &&
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[2].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[3]
            );
          } else if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[1].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[2]
            );
          } else if (
            mang_gia_tri_thang.findIndex((i) => i.ID === mang_user_1ban[1].ID) <
            0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[1]
            );
          }
        } else if (t1 == 1) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[2].ID
            ) >= 0 &&
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[3].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[0]
            );
          } else if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[2].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[3]
            );
          } else if (
            mang_gia_tri_thang.findIndex((i) => i.ID === mang_user_1ban[2].ID) <
            0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[2]
            );
          }
        } else if (t1 == 2) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[3].ID
            ) >= 0 &&
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[0].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[1]
            );
          } else if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[3].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[0]
            );
          } else if (
            mang_gia_tri_thang.findIndex((i) => i.ID === mang_user_1ban[3].ID) <
            0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[3]
            );
          }
        } else if (t1 == 3) {
          if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[0].ID
            ) >= 0 &&
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[1].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[2]
            );
          } else if (
            mang_gia_tri_thang.findIndex(
              (i) => i.ID === mang_user_1ban[0].ID
            ) >= 0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[1]
            );
          } else if (
            mang_gia_tri_thang.findIndex((i) => i.ID === mang_user_1ban[0].ID) <
            0
          ) {
            mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
              mang_gia_tri_huong_sai,
              socket.ban1,
              mang_user_1ban[0]
            );
          }
        }
      }
      function __cap_nhat_lai_mang_huong_sai_(a, b, c) {
        var d = 0;
        for (var i = 0; i < a.length; i++) {
          if (b.findIndex((x) => x.ID === a[i].ID) >= 0 && c == a[i].BAN) {
            d = 1;
            break;
          }
        }
        return d;
      }
      var _c_n_huong_sai = __cap_nhat_lai_mang_huong_sai_(
        mang_gia_tri_huong_sai,
        mang_thoat_game,
        socket.ban1
      );
      if (_c_n_huong_sai == 1) {
        if (mang_user_1ban.length == 4) {
          if (t1 == 0) {
            if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[1]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[2]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[3]
              );
            }
          } else if (t1 == 1) {
            if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[2]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[3]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[0]
              );
            }
          } else if (t1 == 2) {
            if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[3]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[0]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[1]
              );
            }
          } else if (t1 == 3) {
            if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[0]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[1]
              );
            } else if (
              mang_thoat_game.findIndex((i) => i.ID === mang_user_1ban[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban1,
                mang_user_1ban[2]
              );
            }
          }
        }
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////////////////////
  ////DANH		                                                       ///////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////
  socket.on("user-send-message", function (data) {
    //lang nghe nguoi danh
    ////////////////////////////////////////////////////////////////////

    function _luu_list_bai_(a, a1, b, c) {
      //c:id,b:ban,a1:data
      var k = [];
      for (var i = 0; i < a.length; i++) {
        k.push(a[i]);
      }

      if (k.findIndex((x) => x.BAN === b) < 0) {
        k.push(new Thong_Tin(c, b, a1));
      } else {
        k[k.findIndex((x) => x.BAN === b)].T_S1 = data;
      }
      return k;
    }

    if (data == "") {
      ////luu giai tri bo luot
      if (mangUsers3.findIndex((x) => x.ID === socket.id) < 0)
        mangUsers3.push(new Thong_Tin(socket.id, socket.ban1));
    } else {
      //xoa huong sai
      if (data[data.length - 1] == "@") {
        data.splice(data.length - 1);
      } else {
        for (var i = 0; i < mang_gia_tri_huong_sai.length; i++) {
          if (mang_gia_tri_huong_sai[i].BAN == socket.ban1) {
            mang_gia_tri_huong_sai.splice(i, 1);
            break;
          }
        }
      }
    }

    ///////////////////////////////////////////////////////////////////////////khoi tao gia tri
    function _loc_listMessages_goc(a, b) {
      var a1 = [],
        a2 = [];
      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) a1.push(a[i].T_S1);
      }
      if (typeof a1[0] == "undefined") {
        return a2;
      } else {
        return a1[0];
      }
    }
    var listMessages_1 = _loc_listMessages_goc(listMessages, socket.ban1);
    //console.log(listMessages_1);
    var mangUsers2_loc = mc(mangUsers2, socket.ban); //loc mang nguoi choi cua 1 ban
    io.sockets.in(socket.ban1).emit("server-send-mesage", data); //gui bai danh qua cac doi thu
    io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mesage", data); //gui bai danh qua cac doi thu dang doi
    if (data.length == 1) {
      if (
        data[0] == "anh/16a.png" ||
        data[0] == "anh/16b.png" ||
        data[0] == "anh/16c.png" ||
        data[0] == "anh/16d.png"
      ) {
        io.sockets.in(socket.ban1).emit("server-send-2-ne");
        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-2-ne");
      }
    } else if (data.length == 2) {
      if (
        data[0] == "anh/16a.png" ||
        data[0] == "anh/16b.png" ||
        data[0] == "anh/16c.png" ||
        data[0] == "anh/16d.png"
      ) {
        io.sockets.in(socket.ban1).emit("server-send-2-ne");
        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-2-ne");
      } else if (data[0].substring(6, 4) == "14") {
        if (listMessages_1.length != 0) {
          if (data[0].substring(6, 4) == listMessages_1[0].substring(6, 4)) {
            io.sockets.in(socket.ban1).emit("server-send-doi-di");
            io.sockets
              .in(chuyen_ban_lon(socket.ban1))
              .emit("server-send-doi-di");
          }
        }
      }
    } else if (data.length == 3) {
      if (
        data[0] == "anh/16a.png" ||
        data[0] == "anh/16b.png" ||
        data[0] == "anh/16c.png" ||
        data[0] == "anh/16d.png"
      ) {
        io.sockets.in(socket.ban1).emit("server-send-2-ne");
        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-2-ne");
      } else if (data[0].substring(6, 4) == "13") {
        if (listMessages_1.length != 0) {
          if (listMessages_1[0].substring(6, 4) == "14") {
            io.sockets.in(socket.ban1).emit("server-send-doi-di");
            io.sockets
              .in(chuyen_ban_lon(socket.ban1))
              .emit("server-send-doi-di");
          }
        }
      }
    } else if (data.length > 3) {
      if (
        data.length == 4 &&
        data[0].substring(6, 4) == data[1].substring(6, 4) &&
        listMessages_1.length != 0
      ) {
        io.sockets.in(socket.ban1).emit("server-send-may-ha-buoi");
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-may-ha-buoi");
      } else if (
        data.length == 4 &&
        data[0].substring(6, 4) == data[1].substring(6, 4) &&
        listMessages_1.length == 0
      ) {
        io.sockets.in(socket.ban1).emit("server-send-doi-di");
        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-doi-di");
      } else if (
        data.length == 6 &&
        data[0].substring(6, 4) == data[1].substring(6, 4) &&
        listMessages_1.length == data.length
      ) {
        var r = [1, 2, 3][Math.floor(Math.random() * 3)];
        if (r == 1) {
          io.sockets.in(socket.ban1).emit("server-send-may-ha-buoi");
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-may-ha-buoi");
        } else if (r == 2) {
          io.sockets.in(socket.ban1).emit("server-send-doi-di");
          io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-doi-di");
        } else if (r == 3) {
          io.sockets.in(socket.ban1).emit("server-send-chet-may-ne");
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-chet-may-ne");
        }
        // io.sockets.in(socket.ban1).emit("server-send-doi-di");
      } else if (
        data.length == 6 &&
        data[0].substring(6, 4) == data[1].substring(6, 4)
      ) {
        if (listMessages_1.length != 0) {
          if (listMessages_1[0].substring(6, 4) == "16") {
            var r = [1, 2, 3][Math.floor(Math.random() * 3)];
            if (r == 1) {
              io.sockets.in(socket.ban1).emit("server-send-may-ha-buoi");
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-may-ha-buoi");
            } else if (r == 2) {
              io.sockets.in(socket.ban1).emit("server-send-doi-di");
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-doi-di");
            } else if (r == 3) {
              io.sockets.in(socket.ban1).emit("server-send-chet-may-ne");
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-chet-may-ne");
            }
          }
        }

        //io.sockets.in(socket.ban1).emit("server-send-doi-di");
      } else if (data.length >= 6) {
        io.sockets.in(socket.ban1).emit("server-send-thua-di-cung");
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-thua-di-cung");
        if (data.length == 11) {
          io.sockets.in(socket.ban1).emit("server-send-rong-tim");
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-rong-tim");
        } else if (data.length == 10) {
          io.sockets.in(socket.ban1).emit("server-send-rong-xanh");
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-rong-xanh");
        }
      }
    }
    listMessages = _luu_list_bai_(listMessages, data, socket.ban1, socket.id);
    var luot = loc_luot_nuoc_di_ke_tiep(mangUsers2, mangUsers3, socket.ban1); //tim luot ke tiep
    var n = mc1(mangUsers2, socket.ban); //tim so nguoi choi trong ban hien tai

    /////////////////////////////////////////////////////////////////////////////hoi phuc luot
    var so_nguoi_bo_luot = mc1(mangUsers3, socket.ban1);
    var mang_tong_cuc_bo = [];
    if (mang_thoat_game.length != 0 || mang_gia_tri_thang.length != 0) {
      for (var i = 0; i < mang_thoat_game.length; i++) {
        if (
          mang_tong_cuc_bo.findIndex((x) => x.ID === mang_thoat_game[i].ID) < 0
        )
          mang_tong_cuc_bo.push(mang_thoat_game[i]);
      }
      for (var i = 0; i < mang_gia_tri_thang.length; i++) {
        if (
          mang_gia_tri_thang.findIndex(
            (x) => x.ID === mang_gia_tri_thang[i].ID
          ) < 0
        )
          mang_gia_tri_thang.push(mang_thoat_game[i]);
      }
    }
    if (n == 4) {
      if (aaaa(mang_gia_tri_thang, socket.ban) == 1) {
        //bo qua nguoi toi nhat

        if (xem_huong_sai(mang_gia_tri_huong_sai, socket.ban) == 1) {
          //xet nguoi dc huong sai
          if (so_nguoi_bo_luot == 4) {
            for (var i = 0; i < mangUsers3.length; ) {
              if (
                mangUsers3[i].BAN == socket.ban1 &&
                mang_tong_cuc_bo.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
              ) {
                mangUsers3.splice(i, 1);
              } else {
                i++;
              }
            }

            io.sockets.in(socket.ban1).emit("server-send-mesage", "1"); //xoa bai di van moi
            io.sockets
              .in(chuyen_ban_lon(socket.ban1))
              .emit("server-send-mesage", "1"); //xoa bai di van moi
            //uu tien luot huong sai va huy huong sai
            var hs_1 = lay_huong_sai(
              mang_gia_tri_huong_sai,
              socket.ban,
              mangUsers2_loc
            );

            if (hs_1 == 0) {
              luot[0] = 1;
              luot[1] = 0;
              luot[2] = 0;
              luot[3] = 0;
            } else if (hs_1 == 1) {
              luot[0] = 0;
              luot[1] = 1;
              luot[2] = 0;
              luot[3] = 0;
            } else if (hs_1 == 2) {
              luot[0] = 0;
              luot[1] = 0;
              luot[2] = 1;
              luot[3] = 0;
            } else if (hs_1 == 3) {
              luot[0] = 0;
              luot[1] = 0;
              luot[2] = 0;
              luot[3] = 1;
            }

            for (var i = 0; i < mang_gia_tri_huong_sai.length; i++) {
              if (mang_gia_tri_huong_sai[i].BAN == socket.ban1) {
                mang_gia_tri_huong_sai.splice(i, 1);
              }
            }
          }
        } else {
          if (so_nguoi_bo_luot == 3) {
            for (var i = 0; i < mangUsers3.length; ) {
              if (
                mangUsers3[i].BAN == socket.ban1 &&
                mang_tong_cuc_bo.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
              ) {
                mangUsers3.splice(i, 1);
              } else {
                i++;
              }
            }
            io.sockets.in(socket.ban1).emit("server-send-mesage", "2"); //xoa bai di van moi
            // io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mesage", "1");//xoa bai di van moi
          }
        }
      } else {
        if (so_nguoi_bo_luot == 3) {
          for (var i = 0; i < mangUsers3.length; ) {
            if (
              mangUsers3[i].BAN == socket.ban1 &&
              mang_thoat_game.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
            ) {
              mangUsers3.splice(i, 1);
            } else {
              i++;
            }
          }
          io.sockets.in(socket.ban1).emit("server-send-mesage", "1"); //xoa bai di van moi
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-mesage", "1"); //xoa bai di van moi
        }
      }
    } else if (n == 3) {
      if (aaaa(mang_gia_tri_thang, socket.ban) == 1) {
        if (xem_huong_sai(mang_gia_tri_huong_sai, socket.ban) == 1) {
          if (so_nguoi_bo_luot == 3) {
            for (var i = 0; i < mangUsers3.length; ) {
              if (
                mangUsers3[i].BAN == socket.ban1 &&
                mang_gia_tri_thang.findIndex((x) => x.ID === mangUsers3[i].ID) <
                  0 &&
                mang_thoat_game.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
              ) {
                mangUsers3.splice(i, 1);
              } else {
                i++;
              }
            }
            io.sockets.in(socket.ban1).emit("server-send-mesage", "1"); //xoa bai di van moi
            io.sockets
              .in(chuyen_ban_lon(socket.ban1))
              .emit("server-send-mesage", "1"); //xoa bai di van moi
            //uu tien luot huong sai va huy huong sai
            var hs_1 = lay_huong_sai(
              mang_gia_tri_huong_sai,
              socket.ban,
              mangUsers2_loc
            );

            if (hs_1 == 0) {
              luot[0] = 1;
              luot[1] = 0;
              luot[2] = 0;
              luot[3] = 0;
            } else if (hs_1 == 1) {
              luot[0] = 0;
              luot[1] = 1;
              luot[2] = 0;
              luot[3] = 0;
            } else if (hs_1 == 2) {
              luot[0] = 0;
              luot[1] = 0;
              luot[2] = 1;
              luot[3] = 0;
            }

            for (var i = 0; i < mang_gia_tri_huong_sai.length; i++) {
              if (mang_gia_tri_huong_sai[i].BAN == socket.ban1) {
                mang_gia_tri_huong_sai.splice(i, 1);
              }
            }
          }
        } else {
          if (so_nguoi_bo_luot == 2) {
            for (var i = 0; i < mangUsers3.length; ) {
              if (
                mangUsers3[i].BAN == socket.ban1 &&
                mang_gia_tri_thang.findIndex((x) => x.ID === mangUsers3[i].ID) <
                  0 &&
                mang_thoat_game.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
              ) {
                mangUsers3.splice(i, 1);
              } else {
                i++;
              }
            }
            io.sockets.in(socket.ban1).emit("server-send-mesage", "2"); //xoa bai di van moi
          }
        }
      } else {
        if (so_nguoi_bo_luot == 2) {
          for (var i = 0; i < mangUsers3.length; ) {
            if (
              mangUsers3[i].BAN == socket.ban1 &&
              mang_thoat_game.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
            ) {
              mangUsers3.splice(i, 1);
            } else {
              i++;
            }
          }
          io.sockets.in(socket.ban1).emit("server-send-mesage", "1"); //xoa bai di van moi
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-mesage", "1"); //xoa bai di van moi
        }
      }
    } else if (n == 2) {
      if (so_nguoi_bo_luot == 1) {
        for (var i = 0; i < mangUsers3.length; ) {
          if (
            mangUsers3[i].BAN == socket.ban1 &&
            mang_thoat_game.findIndex((x) => x.ID === mangUsers3[i].ID) < 0
          ) {
            mangUsers3.splice(i, 1);
          } else {
            i++;
          }
        }
        io.sockets.in(socket.ban1).emit("server-send-mesage", "1"); //xoa bai di van moi
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-mesage", "1"); //xoa bai di van moi
      }
    }

    /////////////////////////////////////////////////////////////////////////////

    if (n == 4) {
      var t = 2;
      for (var i = 0; i < luot.length; i++) {
        if (luot[i] == 1) {
          t = i;
          break;
        }
      }

      io.sockets
        .in(socket.ban1)
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);
      //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-rest-dong-ho-id");
      // console.log(mangUsers2_loc[t].ID);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);

      if (luot[0] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[0]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);

        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
        io.sockets.in(socket.ban1).emit("server-send-mau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 1);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 2);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 3);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 4);
      } else {
        //mangUsers_thoat=socket.ban1+socket.id;
        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "0");
      }
      if (luot[1] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[1]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
        io.sockets.in(socket.ban1).emit("server-send-mau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 2);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 1);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 3);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 4);
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
      } else {
        // mangUsers_thoat=socket.ban1+socket.id;
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "0");
      }
      if (luot[2] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[2]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
        io.sockets.in(socket.ban1).emit("server-send-mau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 3);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 2);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 4);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 1);
        io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
      } else {
        //mangUsers_thoat=socket.ban1+socket.id;
        io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "0");
      }
      if (luot[3] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[3]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
        io.sockets.in(socket.ban1).emit("server-send-mau", 4);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

        io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-mau", 4);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 3);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 2);
        io.sockets
          .in(chuyen_ban_lon(socket.ban1))
          .emit("server-send-huymau", 1);
        io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
      } else {
        io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "0");
      }
    } else if (n == 3) {
      var t = 2;
      for (var i = 0; i < luot.length; i++) {
        if (luot[i] == 1) {
          t = i;
          break;
        }
      }

      io.sockets
        .in(socket.ban1)
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);

      var socket_ban_1 = chuyen_ban_lon(socket.ban1);
      if (luot[0] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[0]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");

        io.sockets.in(socket.ban1).emit("server-send-mau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

        io.sockets.in(socket_ban_1).emit("server-send-mau", 1);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 2);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 3);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 4);
      } else {
        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "0");
      }
      if (luot[1] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[1]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
        io.sockets.in(socket.ban1).emit("server-send-mau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

        io.sockets.in(socket_ban_1).emit("server-send-mau", 2);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 1);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 3);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 4);
      } else {
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "0");
      }
      if (luot[2] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[2]
        );
        io.sockets
          .in(socket.ban1)
          .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
        io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
        io.sockets.in(socket.ban1).emit("server-send-mau", 3);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

        io.sockets.in(socket_ban_1).emit("server-send-mau", 3);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 1);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 2);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 4);
      } else {
        io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "0");
      }
    } else if (n == 2) {
      var t = 2;
      for (var i = 0; i < luot.length; i++) {
        if (luot[i] == 1) {
          t = i;
          break;
        }
      }

      io.sockets
        .in(socket.ban1)
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-dong-ho-id-2", mangUsers2_loc[t].ID);

      var socket_ban_1 = chuyen_ban_lon(socket.ban1);
      if (luot[0] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[0]
        );

        io.sockets.in(socket.ban1).emit("server-send-mau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

        io.sockets.in(socket_ban_1).emit("server-send-mau", 1);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 2);

        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
      } else {
        io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "0");
      }
      if (luot[1] == 1) {
        mangUsers_thoat = cap_nhat_mangUsers_thoat(
          mangUsers_thoat,
          mangUsers2_loc[1]
        );

        io.sockets.in(socket.ban1).emit("server-send-mau", 2);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
        io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

        io.sockets.in(socket_ban_1).emit("server-send-mau", 2);
        io.sockets.in(socket_ban_1).emit("server-send-huymau", 1);
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
      } else {
        io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "0");
      }
    }
  });
  socket.on("disconnect", function () {
    io.sockets.in(socket.ban1).emit("server-send-leave-ban");
    io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-leave-ban");
    function _check_1_(a, b) {
      var c = 0;

      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) {
          c = 1;
          break;
        }
      }

      return c;
    }

    if (_check_1_(mang_luu_trang_thai_choi, socket.ban1) == 1) {
      mang_thoat_game.push(new Thong_Tin(socket.id, socket.ban));
      /////
      io.sockets
        .in(socket.ban1)
        .emit("server-send-vi-tri-thoat-roi-ban", mang_thoat_game);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-vi-tri-thoat-roi-ban", mang_thoat_game);
      /////
      if (mangUsers3.findIndex((x) => x.ID === socket.id) < 0) {
        mangUsers3.push(new Thong_Tin(socket.id, socket.ban1));
      }

      io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");

      function kiem_tra_huong_sai_dang_thoat(a, b) {
        var dem = 0;

        for (var i = 0; i < a.length; i++) {
          if (a[i].BAN == b) {
            dem = 1;
            break;
          }
        }

        return dem;
      }

      function k_t_user_thoat_moi_ban(a1, a2) {
        var c = 0;

        for (var i = 0; i < a1.length; i++) {
          if (a1[i].BAN + a1[i].ID == a2) {
            c = 1;
            break;
          }
        }

        return c;
      }

      function _d_gia_tri_bai_con_lai(a, b) {
        var dem = 0;
        for (var i = 0; i < a.length; i++) {
          if (a[i].BAN == b && a[i].T_S1 != "") dem++;
        }
        return dem;
      }
      function mang_t_3(a, b) {
        var c = [];

        for (var i = 0; i < a.length; i++) {
          if (a[i].BAN == b && a[i].T_S1 == "undefined") {
            c.push("");
          } else {
            c.push(a[i].T_S1);
          }
        }

        return c;
      }
      function _mangUsers_thoat_loc2_f_(a, b) {
        var c = 0;
        if (a.length != 0) {
          if (b.findIndex((X) => X.ID === a[0].ID) >= 0) {
            c = b.findIndex((X) => X.ID === a[0].ID);
          }
        }

        return c;
      }
      function _ham_loc_mang_con_lai_cho_ban_(a) {
        var y = [];
        for (var i = 0; i < a.length; i++) {
          y.push(a[i]);
        }
        if (y.findIndex((X) => X.ID === socket.id) >= 0) {
          y[y.findIndex((X) => X.ID === socket.id)].T_S1 = [];
        }
        var c = 0,
          k = 0;
        for (var i = 0; i < y.length; i++) {
          c = y[i].T_S1;
          if (c.length != 0) {
            k++;
          }
        }

        return k;
      }
      function _luot_di_cho_lan_thoat(m_thoat, mang_u2, thang, vi_tri, BAN3) {
        var a = [],
          b = [],
          c = [],
          luot3 = [];
        for (var i = 0; i < m_thoat.length; i++) {
          if (m_thoat[i].BAN == BAN3) a.push(m_thoat[i]);
        }
        for (var i = 0; i < thang.length; i++) {
          if (thang[i].BAN == BAN3) b.push(thang[i]);
        }
        c = a.concat(b);

        if (mang_u2.length == 4) {
          if (vi_tri == 0) {
            if (c.findIndex((X) => X.ID === mang_u2[1].ID) < 0) {
              luot3.push(mang_u2[1]);
            } else if (c.findIndex((X) => X.ID === mang_u2[2].ID) < 0) {
              luot3.push(mang_u2[2]);
            } else if (c.findIndex((X) => X.ID === mang_u2[3].ID) < 0) {
              luot3.push(mang_u2[3]);
            }
          } else if (vi_tri == 1) {
            if (c.findIndex((X) => X.ID === mang_u2[2].ID) < 0) {
              luot3.push(mang_u2[2]);
            } else if (c.findIndex((X) => X.ID === mang_u2[3].ID) < 0) {
              luot3.push(mang_u2[3]);
            } else if (c.findIndex((X) => X.ID === mang_u2[0].ID) < 0) {
              luot3.push(mang_u2[0]);
            }
          } else if (vi_tri == 2) {
            if (c.findIndex((X) => X.ID === mang_u2[3].ID) < 0) {
              luot3.push(mang_u2[3]);
            } else if (c.findIndex((X) => X.ID === mang_u2[0].ID) < 0) {
              luot3.push(mang_u2[0]);
            } else if (c.findIndex((X) => X.ID === mang_u2[1].ID) < 0) {
              luot3.push(mang_u2[1]);
            }
          } else if (vi_tri == 3) {
            if (c.findIndex((X) => X.ID === mang_u2[0].ID) < 0) {
              luot3.push(mang_u2[0]);
            } else if (c.findIndex((X) => X.ID === mang_u2[1].ID) < 0) {
              luot3.push(mang_u2[1]);
            } else if (c.findIndex((X) => X.ID === mang_u2[2].ID) < 0) {
              luot3.push(mang_u2[2]);
            }
          }
        } else if (mang_u2.length == 3) {
          if (vi_tri == 0) {
            if (c.findIndex((X) => X.ID === mang_u2[1].ID) < 0) {
              luot3.push(mang_u2[1]);
            } else if (c.findIndex((X) => X.ID === mang_u2[2].ID) < 0) {
              luot3.push(mang_u2[2]);
            }
          } else if (vi_tri == 1) {
            if (c.findIndex((X) => X.ID === mang_u2[2].ID) < 0) {
              luot3.push(mang_u2[2]);
            } else if (c.findIndex((X) => X.ID === mang_u2[0].ID) < 0) {
              luot3.push(mang_u2[0]);
            }
          } else if (vi_tri == 2) {
            if (c.findIndex((X) => X.ID === mang_u2[0].ID) < 0) {
              luot3.push(mang_u2[0]);
            } else if (c.findIndex((X) => X.ID === mang_u2[1].ID) < 0) {
              luot3.push(mang_u2[1]);
            }
          }
        }

        return luot3;
      }
      //var vtthang= mangUsers2.indexOf(socket.ban+socket.id);
      var so_nguoi_trong_ban = 0;

      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      mang_tam = xoa_mang1(mang_tam, socket.ban + socket.id);
      var mangUsers2_loc = mc(mangUsers2, socket.ban);
      var mangUsers3_loc = mc(mangUsers3, socket.ban);
      var mq = mc(mang_tam, socket.ban);

      var mt1 = mang_t(mang_ten, socket.ban);
      //var mang_thoat_game_loc=loc_ban_nguoi_thoat_game(mang_thoat_game,socket.ban);
      //var thoat_vs_goc=giao_mang_thoat_v_goc(mangUsers2_loc,mang_thoat_game_loc);
      //var so_nguoi_trong_ban1=mc1(mangUsers2,socket.ban);
      //var so_nguoi_trong_ban2=dem_ban_nguoi_thoat_game(mang_thoat_game,socket.ban);

      var _ktr_huong_sai_ = kiem_tra_huong_sai_dang_thoat(
        mang_gia_tri_huong_sai,
        socket.ban
      );
      var _b_k_t_user_thoat_moi_ban = k_t_user_thoat_moi_ban(
        mangUsers_thoat,
        socket.ban + socket.id
      );
      var d1 = _xem_nguoi_tiep_tuc_danh(
        mangUsers2,
        mang_thoat_game,
        socket.ban1
      );
      var mangUsers_thoat_loc = mc(mangUsers_thoat, socket.ban);
      var mangUsers_thoat_loc2 = _mangUsers_thoat_loc2_f_(
        mangUsers_thoat_loc,
        mangUsers2_loc
      );
      ///////////////////////////

      //0 1 2
      ///////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////
      //xy ly update huong sai mang_thoat_game.findIndex(X => X.ID === mangUsers2_loc[1].ID)<0 ||
      //console.log(mang_luu_trang_thai_choi);
      if (mang_gia_tri_huong_sai.findIndex((X) => X.ID === socket.id) >= 0) {
        if (mangUsers2_loc.length == 3) {
        } else if (mangUsers2_loc.length == 4) {
          //0 1 2 3
          if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
            if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[1].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[2].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[3].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1) {
            if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[2].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[3].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[0].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2) {
            if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[3].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[0].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[1].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 3) {
            if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[0].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[1].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            } else if (
              mang_gia_tri_huong_sai.findIndex(
                (X) => X.ID === mangUsers2_loc[2].ID
              ) < 0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            }
          }
        }
      }

      ///////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////
      //xu ly update huong sai khi thoat 2
      if (mang_gia_tri_huong_sai.findIndex((X) => X.ID === socket.id) >= 0) {
        if (mangUsers2_loc.length == 3) {
        } else if (mangUsers2_loc.length == 4) {
          //0 1 2 3
          if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
            if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1) {
            if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2) {
            if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[3]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            }
          } else if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 3) {
            if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[0]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[1]
              );
            } else if (
              mangUsers_thoat.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
              0
            ) {
              mang_gia_tri_huong_sai = mang_gia_tri_huong_sai_nap_chong(
                mang_gia_tri_huong_sai,
                socket.ban,
                mangUsers2_loc[2]
              );
            }
          }
        }
      }
      ///////////////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////
      /* if(mangUsers2_loc.length==2)
			  {		 
					 io.to(mangUsers2_loc[0].ID).emit("server-send-vitri","12"+mt1[0]+"#"+mt1[1]);
					 io.to(mangUsers2_loc[1].ID).emit("server-send-vitri","22"+mt1[1]+"#"+mt1[0]);
					 			 
			  }
			  else if(mangUsers2_loc.length==3)
			  {	     
					
					 io.to(mangUsers2_loc[0].ID).emit("server-send-vitri","13"+mt1[0]+"#"+mt1[1]+"@"+mt1[2]);
					 io.to(mangUsers2_loc[1].ID).emit("server-send-vitri","23"+mt1[1]+"#"+mt1[2]+"@"+mt1[0]);
					 io.to(mangUsers2_loc[2].ID).emit("server-send-vitri","33"+mt1[2]+"#"+mt1[0]+"@"+mt1[1]);			 
			  }else if(mangUsers2_loc.length==1){
				//xy ly  
			  }else if(mangUsers2_loc.length==4){	
		        io.to(mangUsers2_loc[0].ID).emit("server-send-vitri","14"+mt1[0]+"#"+mt1[1]+"@"+mt1[2]+"%"+mt1[3]);
		        io.to(mangUsers2_loc[1].ID).emit("server-send-vitri","24"+mt1[1]+"#"+mt1[2]+"@"+mt1[3]+"%"+mt1[0]);
			    io.to(mangUsers2_loc[2].ID).emit("server-send-vitri","34"+mt1[2]+"#"+mt1[3]+"@"+mt1[0]+"%"+mt1[1]);
			    io.to(mangUsers2_loc[3].ID).emit("server-send-vitri","44"+mt1[3]+"#"+mt1[0]+"@"+mt1[1]+"%"+mt1[2]);					  
			  }*/
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      //console.log(mangUsers_thoat);
      //console.log("_ktr_huong_sai_"+_ktr_huong_sai_);
      //console.log("_b_k_t_user_thoat_moi_ban"+_b_k_t_user_thoat_moi_ban);
      var loc_mang_con_lai_cho_tung_ban = mc(mang_bai_con_lai, socket.ban1);
      var bien_mang_con_lai = _ham_loc_mang_con_lai_cho_ban_(
        loc_mang_con_lai_cho_tung_ban
      );
      //console.log(mangUsers3_loc);
      if (mangUsers2_loc.length == 2) {
        // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",d1);

        if (_b_k_t_user_thoat_moi_ban == 1) {
          io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
          io.to(d1).emit("server-send-tiep-tuc-danh", "1");
          io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-nhan-ban-full", "1");
          mang_luu_trang_thai_choi = _luu_on_off_user(
            mang_luu_trang_thai_choi,
            socket.ban1,
            "off"
          );
        }
      } else if (mangUsers2_loc.length == 3) {
        var mang_tong_cuc_bo = [];
        if (mang_thoat_game.length != 0 || mang_gia_tri_thang.length != 0) {
          for (var i = 0; i < mang_thoat_game.length; i++) {
            if (
              mang_tong_cuc_bo.findIndex(
                (x) => x.ID === mang_thoat_game[i].ID
              ) < 0
            )
              mang_tong_cuc_bo.push(mang_thoat_game[i]);
          }
          for (var i = 0; i < mang_gia_tri_thang.length; i++) {
            if (
              mang_gia_tri_thang.findIndex(
                (x) => x.ID === mang_gia_tri_thang[i].ID
              ) < 0
            )
              mang_gia_tri_thang.push(mang_thoat_game[i]);
          }
        }
        if (_ktr_huong_sai_ == 1) {
          if (_b_k_t_user_thoat_moi_ban == 1) {
            if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
              if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);

                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
                // io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
                // io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            }
          } else {
            if (mangUsers_thoat_loc2 == 0) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[0]
              );
            } else if (mangUsers_thoat_loc2 == 1) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[1]
              );
            } else if (mangUsers_thoat_loc2 == 2) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[2]
              );
            }
          }
        } else {
          if (_b_k_t_user_thoat_moi_ban == 1) {
            // io.sockets.in(socket.ban1).emit("server-send-mesage1","0");
            if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
              if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-nhan-ban-full", "1");
                mang_luu_trang_thai_choi = _luu_on_off_user(
                  mang_luu_trang_thai_choi,
                  socket.ban1,
                  "off"
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                // io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                for (var i = 0; i < mangUsers3.length; ) {
                  if (
                    mangUsers3[i].BAN == socket.ban1 &&
                    mang_tong_cuc_bo.findIndex(
                      (X) => X.ID === mangUsers3[i].ID
                    ) < 0
                  ) {
                    mangUsers3.splice(i, 1);
                  } else {
                    i++;
                  }
                }
              }
            }
          } else {
            //io.sockets.in(socket.ban1).emit("server-send-mesage1","0");
            if (mangUsers_thoat_loc2 == 0) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[0]
              );
            } else if (mangUsers_thoat_loc2 == 1) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[1]
              );
            } else if (mangUsers_thoat_loc2 == 2) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[2]
              );
            }
          }
        }
      } else if (mangUsers2_loc.length == 4) {
        var mang_tong_cuc_bo = [];
        if (mang_thoat_game.length != 0 || mang_gia_tri_thang.length != 0) {
          for (var i = 0; i < mang_thoat_game.length; i++) {
            if (
              mang_tong_cuc_bo.findIndex(
                (x) => x.ID === mang_thoat_game[i].ID
              ) < 0
            )
              mang_tong_cuc_bo.push(mang_thoat_game[i]);
          }
          for (var i = 0; i < mang_gia_tri_thang.length; i++) {
            if (
              mang_gia_tri_thang.findIndex(
                (x) => x.ID === mang_gia_tri_thang[i].ID
              ) < 0
            )
              mang_gia_tri_thang.push(mang_thoat_game[i]);
          }
        }
        var l1 = 1;
        l2 = 2;
        l3 = 3;
        l4 = 4;
        if (_ktr_huong_sai_ == 1) {
          if (_b_k_t_user_thoat_moi_ban == 1) {
            //io.sockets.in(socket.ban1).emit("server-send-mesage1","0");

            if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
              if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[3].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                // io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[2]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[2]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[1]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[1]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                }
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  0,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-xoa-list", 1);
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                if (bien_mang_con_lai == 3) {
                  // io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[2]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[1]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                // io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  1,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-xoa-list", 1);
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[1]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[1]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 4);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[3]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  2,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-xoa-list", 1);
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 3
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                // io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[2]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[2]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                if (bien_mang_con_lai == 3) {
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", 4);
                  io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    mangUsers2_loc[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                //io.sockets.in(socket.ban1).emit("server-send-xoa-list",1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  3,
                  socket.ban1
                );

                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  //console.log("luot "+luot4[0].ID)
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-xoa-list", 1);
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                // io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            }
          } else {
            // io.sockets.in(socket.ban1).emit("server-send-mesage1","0");
            //console.log(mangUsers_thoat_loc2);
            if (mangUsers_thoat_loc2 == 0) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[0]
              );
            } else if (mangUsers_thoat_loc2 == 1) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[1]
              );
            } else if (mangUsers_thoat_loc2 == 2) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[2]
              );
            } else if (mangUsers_thoat_loc2 == 3) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 4);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 4);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[3]
              );
            }
          }
        } else {
          if (_b_k_t_user_thoat_moi_ban == 1) {
            // io.sockets.in(socket.ban1).emit("server-send-mesage1","0");
            if (mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 0) {
              if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  0,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
                //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 1
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  1,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                  //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 2
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 4);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[3]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[3].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  2,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                  //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }
                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
              }
            } else if (
              mangUsers2_loc.findIndex((X) => X.ID === socket.id) == 3
            ) {
              if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[0].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[2].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[2]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[2].ID);
              } else if (
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[0].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 2);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[0]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[1].ID) <
                  0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex((X) => X.ID === mangUsers2_loc[3].ID) <
                  0
              ) {
                io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                io.sockets.in(socket.ban1).emit("server-send-mau", 2);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
                io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-mau", 2);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 1);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 3);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-huymau", 4);
                io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
                mangUsers_thoat = cap_nhat_mangUsers_thoat(
                  mangUsers_thoat,
                  mangUsers2_loc[1]
                );
                io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(socket.ban1)
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-rest-dong-ho-id");
                io.sockets
                  .in(chuyen_ban_lon(socket.ban1))
                  .emit("server-send-dong-ho-id-2", mangUsers2_loc[1].ID);
              } else if (
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[0].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[1].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[2].ID
                ) >= 0 &&
                mangUsers3_loc.findIndex(
                  (X) => X.ID === mangUsers2_loc[3].ID
                ) >= 0
              ) {
                var luot4 = _luot_di_cho_lan_thoat(
                  mang_thoat_game,
                  mangUsers2_loc,
                  mang_gia_tri_thang,
                  3,
                  socket.ban1
                );
                if (bien_mang_con_lai == 3) {
                  io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
                  io.to(d1).emit("server-send-tiep-tuc-danh", "1");
                  io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-nhan-ban-full", "1");
                  mang_luu_trang_thai_choi = _luu_on_off_user(
                    mang_luu_trang_thai_choi,
                    socket.ban1,
                    "off"
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  //io.sockets.in(chuyen_ban_lon(socket.ban1)).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                  //io.sockets.in(socket.ban1).emit("server-send-dong-ho-id-2",mangUsers2_loc[1].ID);
                } else {
                  if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 0
                  ) {
                    l1 = 1;
                    l2 = 2;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 1
                  ) {
                    l1 = 2;
                    l2 = 1;
                    l3 = 3;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 2
                  ) {
                    l1 = 3;
                    l2 = 1;
                    l3 = 2;
                    l4 = 4;
                  } else if (
                    mangUsers2_loc.findIndex((X) => X.ID === luot4[0].ID) == 3
                  ) {
                    l1 = 4;
                    l2 = 1;
                    l3 = 2;
                    l4 = 3;
                  }

                  for (var i = 0; i < mangUsers3.length; ) {
                    if (
                      mangUsers3[i].BAN == socket.ban1 &&
                      mang_tong_cuc_bo.findIndex(
                        (X) => X.ID === mangUsers3[i].ID
                      ) < 0
                    ) {
                      mangUsers3.splice(i, 1);
                    } else {
                      i++;
                    }
                  }
                  io.sockets.in(socket.ban1).emit("server-send-mau", l1);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l2);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l3);
                  io.sockets.in(socket.ban1).emit("server-send-huymau", l4);

                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-mau", l1);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l2);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l3);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-huymau", l4);
                  io.to(luot4[0].ID).emit("server-send-mesage1", "1");
                  mangUsers_thoat = cap_nhat_mangUsers_thoat(
                    mangUsers_thoat,
                    luot4[0]
                  );
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(socket.ban1)
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-rest-dong-ho-id");
                  io.sockets
                    .in(chuyen_ban_lon(socket.ban1))
                    .emit("server-send-dong-ho-id-2", luot4[0].ID);
                }
              }
            }
          } else {
            if (mangUsers_thoat_loc2 == 0) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[0].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[0]
              );
            } else if (mangUsers_thoat_loc2 == 1) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[1].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[1]
              );
            } else if (mangUsers_thoat_loc2 == 2) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 4);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 4);
              io.to(mangUsers2_loc[2].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[2]
              );
            } else if (mangUsers_thoat_loc2 == 3) {
              io.sockets.in(socket.ban1).emit("server-send-mau", 4);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 2);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 3);
              io.sockets.in(socket.ban1).emit("server-send-huymau", 1);

              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-mau", 4);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 2);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 3);
              io.sockets
                .in(chuyen_ban_lon(socket.ban1))
                .emit("server-send-huymau", 1);
              io.to(mangUsers2_loc[3].ID).emit("server-send-mesage1", "1");
              mangUsers_thoat = cap_nhat_mangUsers_thoat(
                mangUsers_thoat,
                mangUsers2_loc[3]
              );
            }
          }
        }
      }
      if (mang_bai_con_lai.length != 0) {
        for (
          var i = 0;
          i < mang_bai_con_lai.length;
          i++ //xoa id user mang_bai_con_lai(mang luu bai con lai toi bet)
        ) {
          if (
            mang_bai_con_lai[i].BAN + mang_bai_con_lai[i].ID ==
            socket.ban + socket.id
          ) {
            mang_bai_con_lai.splice(i, 1);
          }
        }

        //console.log(mang_bai_con_lai);

        if (
          _d_gia_tri_bai_con_lai(mang_bai_con_lai, socket.ban) == 1 &&
          bien_mang_con_lai < 2
        ) {
          io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
          io.to(d1).emit("server-send-tiep-tuc-danh", "1");

          io.sockets.in(socket.ban1).emit("server-send-xoa-list", 1);
          io.sockets
            .in(chuyen_ban_lon(socket.ban1))
            .emit("server-send-nhan-ban-full", "1");
          mang_luu_trang_thai_choi = _luu_on_off_user(
            mang_luu_trang_thai_choi,
            socket.ban1,
            "off"
          );
          io.sockets.in(socket.ban1).emit("server-send-rest-dong-ho-id");
          var t7 = 0;
          for (var i = 0; i < mang_bai_con_lai.length; i++) {
            if (
              mang_bai_con_lai[i].BAN == socket.ban1 &&
              mang_bai_con_lai[i].T_S1 != ""
            ) {
              t7 = i;
              break;
            }
          }
          var res = mang_bai_con_lai[t7].T_S1;

          io.sockets.in(socket.ban).emit("server-send-bai-thua-cuoi", res); //
          io.sockets
            .in(chuyen_ban_lon(socket.ban))
            .emit("server-send-bai-thua-cuoi", res); //
        }
      }
      /*function _reset_tat_ca_(con_lai,t_hang,mang_3,h_sai,m_thoat,m_ten,m_ten_1,mang_ket_thuc,mang_b_tam,mang_trang_t_ban,m_angchat,mang_trang_t_ban_1,ban){
						for(var i=0;i<a.length;){
						  if(a[i]==socket.ban1){
							a.splice(i, 1);
						  }else{
							i++;
						  }
						}
					}*/
      function _kiem_trang_nguoi_danh_con_nhieu(a, b, c) {
        //[ Thong_Tin { ID: '?', BAN: 'ban00', T_S1: 'on', T_S2: undefined } ]
        var dem1 = 0,
          dem2 = 0;
        for (var i = 0; i < a.length; i++) {
          //if(b.findIndex(X => X.id === a[i].id)>=0 && a[i].BAN==c){
          if (a[i].BAN == c) {
            dem1++;
          }
        }
        for (var i = 0; i < b.length; i++) {
          if (b[i].BAN == c) {
            dem2++;
          }
        }

        return dem1 - dem2;
      }

      if (
        mang_luu_trang_thai_choi.findIndex((X) => X.BAN === socket.ban1) >= 0 &&
        mang_luu_trang_thai_choi.findIndex((X) => X.T_S1 === "off") >= 0
      ) {
        if (
          _kiem_trang_nguoi_danh_con_nhieu(
            mangUsers2,
            mang_thoat_game,
            socket.ban1
          ) == 1
        ) {
          for (var i = 0; i < mang_bai_con_lai.length; ) {
            if (mang_bai_con_lai[i].BAN == socket.ban1) {
              mang_bai_con_lai.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_gia_tri_thang.length; ) {
            if (mang_gia_tri_thang[i].BAN == socket.ban1) {
              mang_gia_tri_thang.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers3.length; ) {
            if (mangUsers3[i].BAN == socket.ban1) {
              mangUsers3.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_gia_tri_huong_sai.length; ) {
            if (mang_gia_tri_huong_sai[i].BAN == socket.ban1) {
              mang_gia_tri_huong_sai.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_thoat.length; ) {
            if (mangUsers_thoat[i].BAN == socket.ban1) {
              mangUsers_thoat.splice(i, 1);
            } else {
              i++;
            }
          }
          mang_ten = _giao_2_mang_trung_p_t(mang_ten, mang_thoat_game);
          mang_ten1 = _giao_2_mang_trung_p_t(mang_ten1, mang_thoat_game);
          for (var i = 0; i < mangUsers_ket_thuc_van.length; ) {
            if (mangUsers_ket_thuc_van[i].BAN == socket.ban1) {
              mangUsers_ket_thuc_van.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_ban_tam.length; ) {
            if (mangUsers_ban_tam[i].BAN == socket.ban1) {
              mangUsers_ban_tam.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_trang_thai_ban_tam1.length; ) {
            if (mangUsers_trang_thai_ban_tam1[i].BAN == socket.ban1) {
              mangUsers_trang_thai_ban_tam1.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_chat.length; ) {
            if (mangUsers_chat[i].BAN == socket.ban1) {
              mangUsers_chat.splice(i, 1);
            } else {
              i++;
            }
          }

          mang_luu_trang_thai_choi = _luu_on_off_user(
            mang_luu_trang_thai_choi,
            socket.ban1,
            "off"
          );

          for (var i = 0; i < mang_tam.length; ) {
            if (mang_tam[i].BAN == socket.ban1) {
              mang_tam.splice(i, 1);
            } else {
              i++;
            }
          }

          mangUsers2 = _giao_2_mang_trung_p_t(mangUsers2, mang_thoat_game);

          for (var i = 0; i < mang_thoat_game.length; ) {
            if (mang_thoat_game[i].BAN == socket.ban1) {
              mang_thoat_game.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < listMessages.length; ) {
            if (listMessages[i].BAN == socket.ban1) {
              listMessages.splice(i, 1);
            } else {
              i++;
            }
          }
        } else if (
          _kiem_trang_nguoi_danh_con_nhieu(
            mangUsers2,
            mang_thoat_game,
            socket.ban1
          ) == 0
        ) {
          for (var i = 0; i < listMessages.length; ) {
            if (listMessages[i].BAN == socket.ban1) {
              listMessages.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_bai_con_lai.length; ) {
            if (mang_bai_con_lai[i].BAN == socket.ban1) {
              mang_bai_con_lai.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_gia_tri_thang.length; ) {
            if (mang_gia_tri_thang[i].BAN == socket.ban1) {
              mang_gia_tri_thang.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers3.length; ) {
            if (mangUsers3[i].BAN == socket.ban1) {
              mangUsers3.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_gia_tri_huong_sai.length; ) {
            if (mang_gia_tri_huong_sai[i].BAN == socket.ban1) {
              mang_gia_tri_huong_sai.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_thoat.length; ) {
            if (mangUsers_thoat[i].BAN == socket.ban1) {
              mangUsers_thoat.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_ten.length; ) {
            if (mang_ten[i].BAN == socket.ban1) {
              mang_ten.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_ten1.length; ) {
            if (mang_ten1[i].BAN == socket.ban1) {
              mang_ten1.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_ket_thuc_van.length; ) {
            if (mangUsers_ket_thuc_van[i].BAN == socket.ban1) {
              mangUsers_ket_thuc_van.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_ban_tam.length; ) {
            if (mangUsers_ban_tam[i].BAN == socket.ban1) {
              mangUsers_ban_tam.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_trang_thai_ban_tam1.length; ) {
            if (mangUsers_trang_thai_ban_tam1[i].BAN == socket.ban1) {
              mangUsers_trang_thai_ban_tam1.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers_chat.length; ) {
            if (mangUsers_chat[i].BAN == socket.ban1) {
              mangUsers_chat.splice(i, 1);
            } else {
              i++;
            }
          }

          mang_luu_trang_thai_choi = _luu_on_off_user(
            mang_luu_trang_thai_choi,
            socket.ban1,
            "off"
          );

          for (var i = 0; i < mang_tam.length; ) {
            if (mang_tam[i].BAN == socket.ban1) {
              mang_tam.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mangUsers2.length; ) {
            if (mangUsers2[i].BAN == socket.ban1) {
              mangUsers2.splice(i, 1);
            } else {
              i++;
            }
          }
          for (var i = 0; i < mang_thoat_game.length; ) {
            if (mang_thoat_game[i].BAN == socket.ban1) {
              mang_thoat_game.splice(i, 1);
            } else {
              i++;
            }
          }
        }
      }
    } else {
      mangUsers2 = _giao_2_mang_trung_p_t(
        mangUsers2,
        mang_thoat_game,
        socket.ban1
      );
    }

    o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);

    if (typeof socket.ban1 !== "undefined") {
      if (
        mang_luu_trang_thai_choi.findIndex((X) => X.BAN === socket.ban1) >= 0 &&
        mang_luu_trang_thai_choi.findIndex((X) => X.T_S1 === "off") >= 0
      ) {
        for (var i = 0; i < mangUsers2.length; i++) {
          if (
            mang_thoat_game.findIndex((X) => X.ID === mangUsers2[i].ID) < 0 &&
            mangUsers2[i].BAN == socket.ban1 &&
            mangUsers2_loc.length - mangUsers3_loc.length < 2
          ) {
            io.to(mangUsers2[i].ID).emit("server-send-tiep-tuc-danh", "1");
            io.sockets.in(socket.ban1).emit("server-send-mesage1", "0");
            break;
          }
        }
      }
      function _myFunction_2(a) {
        var c3 = parseInt(a.substring(3));

        return c3;
      }
      if (_myFunction_2(socket.ban1) > 49) {
        function _myFunction_1(a, b) {
          var c = [];
          for (var i = 0; i < a.length; i++) {
            c.push(a[i]);
          }

          for (var i = 0; i < c.length; i++) {
            if (c[i].BAN + c[i].ID == b) {
              c.splice(i, 1);
            }
          }
          return c;
        }
        mang_ten1 = _myFunction_1(
          mang_ten1,
          chuyen_ban_nho(socket.ban1) + socket.id
        );

        io.sockets
          .in(socket.ban1)
          .emit(
            "server-send-danh-sach-ten-tam",
            loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
          );
        io.sockets
          .in(chuyen_ban_nho(socket.ban1))
          .emit(
            "server-send-danh-sach-ten-tam",
            loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
          );
      }
    }

    for (var i = 0; i < mang_luu_trang_thai_choi.length; i++) {
      if (
        mang_luu_trang_thai_choi[i].T_S1 == "off" &&
        mang_luu_trang_thai_choi[i].BAN == socket.ban1
      ) {
        mangUsers2 = _giao_2_mang_trung_p_t(mangUsers2, mang_thoat_game);
        mang_ten = _giao_2_mang_trung_p_t(mang_ten, mang_thoat_game);
        o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
        break;
      }
    }

    if (mang_luu_trang_thai_choi.findIndex((X) => X.BAN === socket.ban1) < 0) {
      if (mang_thoat_game.findIndex((X) => X.ID === socket.id) < 0) {
        mang_thoat_game.push(new Thong_Tin(socket.id, socket.ban));
      }
      mang_ten = _giao_2_mang_trung_p_t(mang_ten, mang_thoat_game);
      mangUsers2 = _giao_2_mang_trung_p_t(mangUsers2, mang_thoat_game);
      for (var i = 0; i < mang_thoat_game.length; ) {
        if (mang_thoat_game[i].BAN == socket.ban1) {
          mang_thoat_game.splice(i, 1);
        } else {
          i++;
        }
      }
      for (var i = 0; i < mangUsers_thoat.length; ) {
        if (mangUsers_thoat[i].BAN == socket.ban1) {
          mangUsers_thoat.splice(i, 1);
        } else {
          i++;
        }
      }
      o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
      var mangUsers2_loc = mc(mangUsers2, socket.ban1);
      if (mangUsers2_loc.length != 0) {
        //console.log(mang_luu_trang_thai_choi);
        io.to(mangUsers2[0].ID).emit("server-send-tiep-bat-dau-2");
      }
    }

    if (
      mang_luu_trang_thai_choi.findIndex((X) => X.BAN === socket.ban1) >= 0 &&
      mang_luu_trang_thai_choi.findIndex((X) => X.T_S1 === "on") >= 0
    ) {
      var mang_bai_con_lai_loc_22 = mc_k(
        mang_bai_con_lai,
        mang_ten,
        socket.ban1
      );

      var bai = new Bai_Con(mang_bai_con_lai_loc_22, mangUsers2_loc);

      io.sockets
        .in(socket.ban1)
        .emit("server-send-so-luong-bai-con-lai-show", bai);
      io.sockets
        .in(chuyen_ban_lon(socket.ban1))
        .emit("server-send-so-luong-bai-con-lai-show", bai);
    }
    io.sockets.emit("server-send-tat-ca-ban-so-nguoi", o_f);
    io.sockets.emit("server-send-on-off-trang-thai", o_f);
    io.sockets.emit("server-send-banday", o_f);

    socket.leave(socket.ban1);
    socket.leave(socket.ban);
  });
  socket.on("client-send-ktra-songuoi", function (data) {
    var o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-banday", o_f);
  });
  socket.on("client-send-ktra-ban-dang-danh", function (data) {
    var o_f = new On_Off(mang_luu_trang_thai_choi, mangUsers2, mang_thoat_game);
    io.sockets.emit("server-send-ktra-ban-dang-danh11", o_f);
  });
  socket.on("user-send-roi-ban-tam", function (data) {
    for (
      var i = 0;
      i < mangUsers_ban_tam.length; //xoa id user mangUsers4_loc

    ) {
      if (
        mangUsers_ban_tam[i].ID + mangUsers_ban_tam[i].BAN ==
        socket.id + socket.ban
      ) {
        mangUsers_ban_tam.splice(i, 1);
      } else {
        i++;
      }
    }
    if (mang_ten1 != []) {
      //['ban00tt@1234567890' ]
      function _myFunction_1(a, b) {
        var c = [];
        for (var i = 0; i < a.length; i++) {
          c.push(a[i]);
        }

        for (var i = 0; i < c.length; i++) {
          if (c[i].BAN + c[i].ID == b) {
            c.splice(i, 1);
            break;
          }
        }

        return c;
      }

      mang_ten1 = _myFunction_1(
        mang_ten1,
        chuyen_ban_nho(socket.ban1) + socket.id
      );
    }

    io.sockets
      .in(socket.ban1)
      .emit(
        "server-send-danh-sach-ten-tam",
        loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
      );
    io.sockets
      .in(chuyen_ban_nho(socket.ban1))
      .emit(
        "server-send-danh-sach-ten-tam",
        loc_ten2(mang_ten1, chuyen_ban_nho(socket.ban1))
      );

    socket.leave(socket.ban1);
  });

  socket.on("user-send-check-admin", function (data) {
    // save_render.render("trangchu");
  });
  socket.on("user-send-check-admin1", function () {});
});
