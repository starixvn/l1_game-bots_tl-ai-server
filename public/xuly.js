var socket = io("http://localhost:5000");
//var socket = io("https://tien-len.herokuapp.com");
var timer = 0;
socket.on("error", function () {
  alert("Lỗi kết nối máy chủ");
});
socket.on("connect_failed", function () {
  alert("Lỗi kết nối máy chủ");
});
socket.on("server-send-join-ban", function () {
  $("#tai_truoc16").trigger("play");
});
socket.on("server-send-leave-ban", function () {
  $("#tai_truoc17").trigger("play");
});
socket.on("server-send-BatDauGame", function () {
  $("#tai_truoc7").trigger("play");
});
socket.on("server-send-thang-1", function () {
  $("#tai_truoc10").trigger("play");
});
socket.on("server-send-thang-2", function () {
  $("#tai_truoc11").trigger("play");
});
socket.on("server-send-thang-3", function () {
  $("#tai_truoc12").trigger("play");
});
socket.on("server-send-thua-bet", function () {
  $("#tai_truoc13").trigger("play");
});
socket.on("server-send-2-ne", function () {
  $("#tai_truoc6").trigger("play");
});
socket.on("server-send-toi-trang", function () {
  $("#tai_truoc14").trigger("play");
});
socket.on("server-send-thua-bet-bet", function () {
  $("#tai_truoc13").trigger("play");
});
socket.on("server-send-thua-di-cung", function () {
  $("#tai_truoc2").trigger("play");
});
socket.on("server-send-may-ha-buoi", function () {
  $("#tai_truoc3").trigger("play");
});
socket.on("server-send-doi-di", function () {
  $("#tai_truoc5").trigger("play");
});
socket.on("server-send-chet-may-ne", function () {
  $("#tai_truoc4").trigger("play");
});
socket.on("server-send-tiep-bat-dau-2", function () {
  $("#btnbatdau").show();
});
socket.on("server-send-mesage1", function (data) {
  var id = socket.io.engine.id;
  document.getElementById("b16").value = id;
  if (data == "0") {
    $("#btnSendMessage").hide();
    $("#btnboluot").hide();
  } else {
    $("#btnSendMessage").show();
    $("#btnboluot").show();
  }
});
socket.on("server-send-rest-dong-ho-id", function () {
  clearInterval(timer);
  $(".counter").remove();
  $(".progressbar").remove();
});
socket.on("server-send-dong-ho-id-2", function (data) {
  clearInterval(timer);
  var k = 0;
  $(".counter").remove();
  $(".progressbar").remove();

  var ban = document.getElementById("b11").value;

  if (parseInt(ban.substring(3)) < 49) {
    if ($("#id1 #i1").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );
      k = 1;
      _dem_nguoc();
    } else if ($("#id1 #i2").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );
      k = 1;

      _dem_nguoc();
    } else if ($("#id1 #i3").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      k = 1;
      _dem_nguoc();
    } else if ($("#id1 #i4").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );
      k = 1;

      _dem_nguoc();
    }

    if (k == 0) {
      if ($("#id2 #i1").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id2").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id2 #i2").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id2").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id2 #i3").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id2").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id2 #i4").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id2").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id3 #i3").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id3").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id3 #i4").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id3").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id3 #i2").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id3").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id3 #i1").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id3").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id4 #i4").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id4").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id4 #i1").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id4").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id4 #i2").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id4").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      } else if ($("#id4 #i3").attr("title") == data) {
        //$("#timer_23").remove();

        $("#id4").append(
          "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
        );

        _dem_nguoc1();
      }
    }
  } else {
    if ($("#id1 #i1").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );
      k = 1;
      _dem_nguoc1();
    } else if ($("#id1 #i2").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );
      k = 1;

      _dem_nguoc1();
    } else if ($("#id1 #i3").attr("title") == data) {
      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id1 #i4").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id1").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id2 #i1").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id2").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id2 #i2").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id2").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id2 #i3").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id2").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id2 #i4").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id2").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id3 #i3").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id3").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id3 #i4").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id3").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id3 #i2").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id3").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id3 #i1").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id3").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id4 #i4").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id4").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id4 #i1").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id4").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id4 #i2").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id4").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    } else if ($("#id4 #i3").attr("title") == data) {
      //$("#timer_23").remove();

      $("#id4").append(
        "<div class='progressbar' style='background: red;width: 30%;'><span class='counter' id='COUNTDOWN_REDIRECT' style='width: 100%;display: block;color: #fff;transition: 300ms width linear;background: green;max-width: 100%;'>25</span></div>"
      );

      _dem_nguoc1();
    }
  }
});

socket.on("server-send-dong-ho-id", function (data) {});

socket.on("server-send-xoa-list", function (data) {
  //xoa list
  if (data == 1) {
    document.getElementById("listMessages").value = "";
    $("#listMessages").html("");
  }
});
socket.on("server-send-ktra-ban-co-bao-nhieu-nguoi", function (data) {
  //xoa list
  //document.getElementById('b14').value=data;
});
socket.on("server-send-phatbai-listMessages", function (data) {
  if (data == "0") {
    document.getElementById("listMessages").value = "";
    $("#listMessages").html("");
  }
});
socket.on("server-send-xoa-list-ban-tam", function () {
  document.getElementById("listMessages").value = "";
  $("#listMessages").html("");
});

socket.on("server-send-batdau", function (data) {
  $("#btnbatdau").show();
});
socket.on("server-send-phatbai", function (data) {
  document.getElementById("thongbao").value = data;
  $("#btnbatdau").hide();
  $("#btntieptuc").hide();

  hien(data);
});
socket.on("server-send-phatbai1", function (data) {
  if (data == "1") {
    $("#btnSendMessage").show();
    $("#btnboluot").show();
  } else {
    $("#btnSendMessage").hide();
    $("#btnboluot").hide();
  }
});

socket.on("server-send-xoa-a", function () {
  setTimeout(function () {
    $("#a").html("");
  }, 900);
});

socket.on("server-send-so-luong-bai-con-lai-show", function (data_1) {
  var data = data_1.BAI;
  var ban = document.getElementById("b11a").value;

  //alert($("#i2").attr('style').split(';').filter(item => item.startsWith('background-color'))[0].split(":")[1].replace(/\s/g, ''));
  for (var i = 0; i < data.length; i++) {
    var songuoi = data[i].T_S1;
    if (typeof ban !== "undefined") {
      if (parseInt(ban.substring(3)) > 49) {
        if ($("#id1 #i1").attr("title") == data[i].ID) {
          $("#xoa0").remove();
          if (typeof $("#id1").find(".counter").html() !== "undefined") {
            $(
              "<span  id='xoa0'>" + " (" + songuoi.length + ")" + "</span>"
            ).insertAfter("#i1");
          } else {
            $("#id1").append(
              "<span id='xoa0'>" + " (" + songuoi.length + ")" + "</span>"
            );
          }
        }
      }
    }
    if ($("#id2 #i2").attr("title") == data[i].ID) {
      $("#xoa1").remove();
      if (typeof $("#id2").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa1'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i2");
      } else {
        $("#id2").append(
          "<span id='xoa1'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id2 #i1").attr("title") == data[i].ID) {
      $("#xoa2").remove();
      if (typeof $("#id2").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa2'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i1");
      } else {
        $("#id2").append(
          "<span id='xoa2'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id3 #i3").attr("title") == data[i].ID) {
      $("#xoa3").remove();
      if (typeof $("#id3").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa3'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i3");
      } else {
        $("#id3").append(
          "<span id='xoa3'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id4 #i4").attr("title") == data[i].ID) {
      $("#xoa4").remove();
      if (typeof $("#id4").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa4'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i4");
      } else {
        $("#id4").append(
          "<span id='xoa4'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id4 #i1").attr("title") == data[i].ID) {
      $("#xoa5").remove();
      if (typeof $("#id4").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa5'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i1");
      } else {
        $("#id4").append(
          "<span id='xoa5'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id3 #i4").attr("title") == data[i].ID) {
      $("#xoa6").remove();
      if (typeof $("#id3").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa6'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i4");
      } else {
        $("#id3").append(
          "<span id='xoa6'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id2 #i3").attr("title") == data[i].ID) {
      $("#xoa7").remove();
      if (typeof $("#id2").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa7'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i3");
      } else {
        $("#id2").append(
          "<span id='xoa7'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id4 #i2").attr("title") == data[i].ID) {
      $("#xoa8").remove();
      if (typeof $("#id4").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa8'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i2");
      } else {
        $("#id4").append(
          "<span id='xoa8'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id3 #i1").attr("title") == data[i].ID) {
      $("#xoa9").remove();
      if (typeof $("#id3").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa9'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i1");
      } else {
        $("#id3").append(
          "<span id='xoa9'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id2 #i4").attr("title") == data[i].ID) {
      $("#xoa10").remove();
      if (typeof $("#id2").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa10'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i4");
      } else {
        $("#id2").append(
          "<span id='xoa10'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id4 #i3").attr("title") == data[i].ID) {
      $("#xoa11").remove();
      if (typeof $("#id4").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa11'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i3");
      } else {
        $("#id4").append(
          "<span id='xoa11'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
    if ($("#id3 #i2").attr("title") == data[i].ID) {
      $("#xoa12").remove();
      if (typeof $("#id3").find(".counter").html() !== "undefined") {
        $(
          "<span  id='xoa12'>" + " (" + songuoi.length + ")" + "</span>"
        ).insertAfter("#i2");
      } else {
        $("#id3").append(
          "<span id='xoa12'>" + " (" + songuoi.length + ")" + "</span>"
        );
      }
    }
  }
});
socket.on("server-send-vi-tri-thoat-roi-ban", function (data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].ID == $("#id1 #i1").attr("title")) {
      $("#id1").html("");
    } else if (data[i].ID == $("#id1 #i2").attr("title")) {
      $("#id1").html("");
    } else if (data[i].ID == $("#id1 #i3").attr("title")) {
      $("#id1").html("");
    } else if (data[i].ID == $("#id1 #i4").attr("title")) {
      $("#id1").html("");
    } else if (data[i].ID == $("#id2 #i1").attr("title")) {
      $("#id2").html("");
    } else if (data[i].ID == $("#id2 #i2").attr("title")) {
      $("#id2").html("");
    } else if (data[i].ID == $("#id2 #i3").attr("title")) {
      $("#id2").html("");
    } else if (data[i].ID == $("#id2 #i4").attr("title")) {
      $("#id2").html("");
    } else if (data[i].ID == $("#id3 #i1").attr("title")) {
      $("#id3").html("");
    } else if (data[i].ID == $("#id3 #i2").attr("title")) {
      $("#id3").html("");
    } else if (data[i].ID == $("#id3 #i3").attr("title")) {
      $("#id3").html("");
    } else if (data[i].ID == $("#id3 #i4").attr("title")) {
      $("#id3").html("");
    } else if (data[i].ID == $("#id4 #i1").attr("title")) {
      $("#id4").html("");
    } else if (data[i].ID == $("#id4 #i2").attr("title")) {
      $("#id4").html("");
    } else if (data[i].ID == $("#id4 #i3").attr("title")) {
      $("#id4").html("");
    } else if (data[i].ID == $("#id4 #i4").attr("title")) {
      $("#id4").html("");
    }
  }
});

socket.on("server-send-vitri", function (data) {
  //var data = "44vinh?sqhTPryD9Q9cI4u7AAAD#hoa!kaTc7FMiCsg2HAYlAAAA@phuoc$Y5C2fLJDyn5yY4XxAAAB%linh^KDW-ierTnWWlAPykAAAC";
  var vtri_ban = document.getElementById("b11").value;
  var arr_usename = document.getElementById("b15").value;

  function loc_ten_ct(a) {
    //a=[vinh?sqhTPryD9Q9cI4u7AAAD]
    var ten = "";
    if (a.length != 0) {
      if (a.indexOf("!") >= 0) {
        ten = a.substring(0, a.indexOf("!"));
      } else if (a.indexOf("$") >= 0) {
        ten = a.substring(0, a.indexOf("$"));
      } else if (a.indexOf("^") >= 0) {
        ten = a.substring(0, a.indexOf("^"));
      } else if (a.indexOf("?") >= 0) {
        ten = a.substring(0, a.indexOf("?"));
      }
    }
    return ten;
  }
  function loc_id_ct(a) {
    var id = "";
    if (a.length != 0) {
      if (a.indexOf("!") >= 0) {
        id = a.substring(a.indexOf("!") + 1);
      } else if (a.indexOf("$") >= 0) {
        id = a.substring(a.indexOf("$") + 1);
      } else if (a.indexOf("^") >= 0) {
        id = a.substring(a.indexOf("^") + 1);
      } else if (a.indexOf("?") >= 0) {
        id = a.substring(a.indexOf("?") + 1);
      }
    }
    return id;
  }

  var t1 = data.substring(0, 1); //1
  var t2 = data.substring(1, 2); //2
  var t22 = data.indexOf("#");
  var t222 = data.indexOf("@");
  var t2222 = data.indexOf("%");
  if (t22 >= 0 && t222 < 0 && t2222 < 0) {
    var t3 = data.substring(2, t22); //vinh
    var t4 = data.substring(t22 + 1); //hoa

    var ten3 = loc_ten_ct(t3);
    var id3 = loc_id_ct(t3);
    var ten4 = loc_ten_ct(t4);
    var id4 = loc_id_ct(t4);
  } else if (t22 >= 0 && (t222 >= 0) & (t2222 < 0)) {
    var t3 = data.substring(2, t22); //vinh
    var t4 = data.substring(t22 + 1, t222); //hoa
    var t5 = data.substring(t222 + 1); //phuoc

    var ten3 = loc_ten_ct(t3);
    var id3 = loc_id_ct(t3);
    var ten4 = loc_ten_ct(t4);
    var id4 = loc_id_ct(t4);
    var ten5 = loc_ten_ct(t5);
    var id5 = loc_id_ct(t5);
  } else if (t22 >= 0 && (t222 >= 0) & (t2222 >= 0)) {
    var t3 = data.substring(2, t22); //vinh
    var t4 = data.substring(t22 + 1, t222); //hoa
    var t5 = data.substring(t222 + 1, t2222); //phuoc
    var t6 = data.substring(t2222 + 1); //linh

    var ten3 = loc_ten_ct(t3);
    var id3 = loc_id_ct(t3);
    var ten4 = loc_ten_ct(t4);
    var id4 = loc_id_ct(t4);
    var ten5 = loc_ten_ct(t5);
    var id5 = loc_id_ct(t5);
    var ten6 = loc_ten_ct(t6);
    var id6 = loc_id_ct(t6);
  }
  $("#id1").html("");
  $("#id2").html("");
  $("#id3").html("");
  $("#id4").html("");
  //$(".xoa_2").remove();
  if (t2 == 2) {
    if (t1 == 1) {
      $("#id1").html(
        "<span class='xoa_2' id='i1' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i2' title=" + id4 + ">" + ten4 + "</span>"
      );
    } else if (t1 == 2) {
      $("#id1").html(
        "<span class='xoa_2' id='i2' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i1' title=" + id4 + ">" + ten4 + "</span>"
      );
    }
  } else if (t2 == 3) {
    if (t1 == 1) {
      $("#id1").html(
        "<span class='xoa_2' id='i1' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i2' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i3' title=" + id5 + ">" + ten5 + "</span>"
      );
    } else if (t1 == 2) {
      $("#id1").html(
        "<span class='xoa_2' id='i2' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i3' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i1' title=" + id5 + ">" + ten5 + "</span>"
      );
    } else if (t1 == 3) {
      $("#id1").html(
        "<span class='xoa_2' id='i3' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i1' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i2' title=" + id5 + ">" + ten5 + "</span>"
      );
    }
  } else if (t2 == 4) {
    if (t1 == 1) {
      $("#id1").html(
        "<span class='xoa_2' id='i1' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i2' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i3' title=" + id5 + ">" + ten5 + "</span>"
      );
      $("#id4").html(
        "<span class='xoa_2' id='i4' title=" + id6 + ">" + ten6 + "</span>"
      );
    } else if (t1 == 2) {
      $("#id1").html(
        "<span class='xoa_2' id='i2' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i3' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i4' title=" + id5 + ">" + ten5 + "</span>"
      );
      $("#id4").html(
        "<span class='xoa_2' id='i1' title=" + id6 + ">" + ten6 + "</span>"
      );
    } else if (t1 == 3) {
      $("#id1").html(
        "<span class='xoa_2' id='i3' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i4' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i1' title=" + id5 + ">" + ten5 + "</span>"
      );
      $("#id4").html(
        "<span class='xoa_2' id='i2' title=" + id6 + ">" + ten6 + "</span>"
      );
    } else if (t1 == 4) {
      $("#id1").html(
        "<span class='xoa_2' id='i4' title=" + id3 + ">" + ten3 + "</span>"
      );
      $("#id2").html(
        "<span class='xoa_2' id='i1' title=" + id4 + ">" + ten4 + "</span>"
      );
      $("#id3").html(
        "<span class='xoa_2' id='i2' title=" + id5 + ">" + ten5 + "</span>"
      );
      $("#id4").html(
        "<span class='xoa_2' id='i3' title=" + id6 + ">" + ten6 + "</span>"
      );
    }
  }
});
socket.on("server-send-huymau", function (data) {
  if (data == 1) $("#i1").css("background-color", "transparent");
  else if (data == 2) $("#i2").css("background-color", "transparent");
  else if (data == 3) $("#i3").css("background-color", "transparent");
  else if (data == 4) $("#i4").css("background-color", "transparent");
});
socket.on("server-send-mau", function (data) {
  //console.log(data);
  if (data == 1) $("#i1").css("background-color", "yellow");
  else if (data == 2) $("#i2").css("background-color", "yellow");
  else if (data == 3) $("#i3").css("background-color", "yellow");
  else if (data == 4) $("#i4").css("background-color", "yellow");
});
///////////////////////////////////////////////////////////////danh va hien
socket.on("server-send-mesage", function (data) {
  if (data == "1") {
    document.getElementById("listMessages").value = "";
    setTimeout(function () {
      $("#listMessages").html("");
    }, 1000);
  } else if (data == "2") {
    document.getElementById("listMessages").value = "";
    setTimeout(function () {
      $("#listMessages").html("");
    }, 1500);
  } else if (data != "") {
    p = data;
    document.getElementById("listMessages").value = p;
    hien2(p);
  }
});
socket.on("server-send-bai-thua-cuoi", function (data) {
  $("#btnSendMessage").hide();
  $("#btnboluot").hide();
  setTimeout(function () {
    $("#listMessages").html("");
    var t = data;
    document.getElementById("listMessages").value = t;
    hien2(t);
    $("#a").html("");
  }, 1500);
});
var u = []; //khai bao bien click danh danh la bai
socket.on("server-send-tiep-tuc-danh", function () {
  u = [];

  setTimeout(function () {
    $("#btntieptuc").show();
  }, 1500);
});
//////////////////////////////////////////////////////////////////
function mc(a, b) {
  var a1 = [];
  for (var i = 0; i < a.length; i++) {
    if (a[i].BAN == b) a1.push(a[i]);
  }
  a1 = xoa_gia_tri_trung(a1);
  return a1;
}

socket.on("server-send-ket-qua-dau-hay-cho", function (data) {
  document.getElementById("b7").value = data;
});
socket.on("server-send-ket-qua-dau-hay-cho-2", function (data) {
  document.getElementById("b8").value = data;
});

socket.on("server-send-nhan-ban-full", function (data) {
  if (data == "") {
    $("#btnchoingay").css("display", "none");
  } else {
    $("#btnchoingay").css("display", "inline-block");
    var ban2 = document.getElementById("b11a").value;
    if (ban2 != "") {
      if (ban2.substring(3) > 49) {
        clearInterval(timer);
        $(".counter").remove();
        $(".progressbar").remove();

        $("#i1").css("background-color", "transparent");

        $("#i2").css("background-color", "transparent");

        $("#i3").css("background-color", "transparent");

        $("#i4").css("background-color", "transparent");
      }
    }
  }
});

socket.on("server-send-banday", function (data) {
  document.getElementById("b10").value = data;
});
socket.on("server-send-on-off-trang-thai", function (data) {
  document.getElementById("b10").value = data;
});
socket.on("server-send-ktra-ban-dang-danh11", function (data) {
  document.getElementById("b10").value = data;
  // alert(document.getElementById('b10').value);
});
socket.on("server-send-id-ban-bai", function (data) {
  document.getElementById("b15").value = data;
});
socket.on("server-send-danh-sach-ten-tam", function (data) {
  document.getElementById("id5").value = data;
  document.getElementById("b12").click();
});

socket.on("server-send-rong-vang", function () {
  document.getElementById("rong-vang").click();
});
socket.on("server-send-rong-tim", function () {
  document.getElementById("rong-tim").click();
});
socket.on("server-send-rong-xanh", function () {
  document.getElementById("rong-xanh").click();
});
socket.on("server-send-tat-ca-ban-so-nguoi", function (data) {
  var data1 = data.B;

  function dem_ten_ban_khi_vao_phong(a, b) {
    var dem = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[i].BAN == b) {
        dem++;
      }
    }
    return dem;
  }

  for (var i = 0; i < 15; i++) {
    if (i < 10) {
      document.getElementById("mb0" + i).innerHTML =
        "Bàn:0" + i + " (" + dem_ten_ban_khi_vao_phong(data1, "ban0" + i) + ")";
    } else {
      document.getElementById("mb" + i).innerHTML =
        "Bàn:" + i + " (" + dem_ten_ban_khi_vao_phong(data1, "ban" + i) + ")";
    }
  }
});
socket.on("server-send-nd-chat", function (data) {
  var html = "";
  var ban = document.getElementById("b11").value;
  if (parseInt(ban.substring(3)) > 49) {
    ban = chuyen_ban_nho(ban);
  }

  for (var i = 0; i < data.length; i++) {
    if (ban == data[i].BAN) html += data[i].T_S1 + ": " + data[i].T_S2 + "<br>";
  }
  $("#id6").html(html);
});
$(document).ready(function () {
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
  function bai_lon(p1, p3) {
    var t = 0;
    if (p3 != "") {
      var h1 = p1[p1.length - 1].substring(4, 6);
      var h3 = p3[p3.length - 1].substring(4, 6);
      var e1 = p1[p1.length - 1].substring(6, 7);
      var e3 = p3[p3.length - 1].substring(6, 7);

      if (e1 == "a") {
        r1 = parseInt(h1) + 0.1;
      } else if (e1 == "b") {
        r1 = parseInt(h1) + 0.2;
      } else if (e1 == "c") {
        r1 = parseInt(h1) + 0.3;
      } else if (e1 == "d") {
        r1 = parseInt(h1) + 0.4;
      }

      if (e3 == "a") {
        r3 = parseInt(h3) + 0.1;
      } else if (e3 == "b") {
        r3 = parseInt(h3) + 0.2;
      } else if (e3 == "c") {
        r3 = parseInt(h3) + 0.3;
      } else if (e3 == "d") {
        r3 = parseInt(h3) + 0.4;
      }
      //alert(r1+":"+r3);
      ktr = kiemtrahople(p1);
      ktr1 = kiemtrahople(p3);

      function ktraheo(p3) {
        n = 0;
        for (var i = 0; i < p3.length; i++) {
          if (p3[i].substring(4, 6) == "16") {
            n = 1;
          } else {
            n = 0;
            break;
          }
        }
        return n;
      }

      if (ktr == ktr1) {
        if (r1 > r3 && p1.length == p3.length) t = 1;
      } else {
        if (ktr == "tuqui" && ktr1 == "3doithong") {
          t = 1;
        } else if (ktr == "4doithong" && ktr1 == "3doithong") {
          t = 1;
        } else if (ktr == "4doithong" && ktr1 == "tuqui") {
          t = 1;
        } else if (ktr == "5doithong" && ktr1 == "4doithong") {
          t = 1;
        } else if (ktr == "5doithong" && ktr1 == "3doithong") {
          t = 1;
        } else if (ktr == "5doithong" && ktr1 == "tuqui") {
          t = 1;
        } else if (ktr == "3doithong" && p3.length <= 1 && ktraheo(p3) == 1) {
          t = 1;
        } else if (ktr == "4doithong" && p3.length <= 3 && ktraheo(p3) == 1) {
          t = 1;
        } else if (ktr == "5doithong" && p3.length <= 4 && ktraheo(p3) == 1) {
          t = 1;
        } else if (ktr == "tuqui" && p3.length <= 2 && ktraheo(p3) == 1) {
          t = 1;
        } //ktr la chon danh ktr1 co san
      }
    } else {
      t = 1;
    }

    return t;
  }

  socket.emit("client-send-ktra-songuoi");
  socket.emit("client-send-ktra-ban-dang-danh");
  socket.emit("user-send-ban-dang-dau-hay-cho-2");
  socket.emit("user-send-tat-ca-ban-so-nguoi-choi");
  socket.emit("user-send-ktra-ban-co-bao-nhieu-nguoi");
  socket.emit("user-send-on-off-trang-thai");
  socket.emit("client-send-ten-id-ban");

  $("#btntieptuc").hide();
  $("#btnbatdau").hide();
  $("#btnboluot").hide();
  $("#btnSendMessage").hide();
  $("#btnchoingay").hide();
  //$("#bancosan").hide();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $(document).on("click", ".image", function () {
    $("#tai_truoc8").trigger("play");
    function timxoa(u, ac, l1) {
      for (var i = 0; i < l1; i++) if (u[i] == ac) return i; //Tìm thấy x tại vị trí thứ i
      return -1; //Không tìm thấy x trong mảng
    }
    //alert($(this).attr("value"));
    //document.getElementById('btnSendMessage').value="";

    if ($(this).css("top") == "100px") {
      $(this).css("top", "50px");
      flag = 0;
    } else {
      $(this).css("top", "100px");
      flag = 1;
    }
    ac = $(this).attr("value");
    l1 = u.length;
    if (flag == 0) {
      u.push(ac);
    } else if (flag == 1) {
      var vt = timxoa(u, ac, l1); //Tìm vị trí x de xoa trong mảng
      u.splice(vt, 1); //xoa vi tri khi la bai keo xuong
    }

    // document.getElementById('btnSendMessage').value=u;
  });

  n = 14; //so ban
  var b = "";
  for (var i = 0; i <= n; i++) {
    if (i < 10) i1 = "0" + i;
    else i1 = i;
    b +=
      "<button type='button' id='mb" +
      i1 +
      "' class='btn btn-warning' value='ban" +
      i1 +
      "' type='button'>Bàn:" +
      i1 +
      " (0)</button>";
  }

  $("#bancosan").html(b);

  $(document).on("click", "#btnSendMessage", function () {
    var data = [];
    var ktr = "khonghople";
    p1 = sapxep(u); //bai danh
    p2 = $("#thongbao").val(); //con lai
    p3 = $("#listMessages").val(); //an
    p4 = $("#btnboluot").val();
    var ban2 = document.getElementById("b11").value;
    ktr = kiemtrahople(p1);

    if (ktr != "khonghople") {
      var f = bai_lon(p1, p3);
      if (f == 1) {
        $("#timer_23").remove();
        $("#tai_truoc9").trigger("play");

        for (var i = 0; i < p1.length; i++) {
          p2.splice(p2.indexOf(p1[i]), 1);
        }
        if (p2 == "") {
          //het bai
          $("#btnSendMessage").hide();
          $("#btnboluot").hide();
          socket.emit("user-send-het-bai-toi", p2); //gui gia tri het bai (da toi)
          p1.push("@");
          socket.emit("user-send-message", p1); //gui gia tri bai danh(ra cay)
        } else {
          $("#btnSendMessage").hide();
          $("#btnboluot").hide();
          socket.emit("user-send-message", p1); //gui gia tri bai danh(ra cay)
        }
        socket.emit("user-send-bai-con-lai", p2); //gui gia tri con lai de hien cuoi van
        hien(p2);
        u = [];
      } else {
        alert("Bài Nhỏ Hơn");
      }
    } else {
      alert("Bài không hợp lệ");
    }
  });
  $("#btnboluot").click(function () {
    $("#timer_23").remove();
    $("#btnSendMessage").hide();
    $("#btnboluot").hide();
    $("#tai_truoc9").trigger("play");
    $("#a .image").css("top", "100px");
    u = [];
    var k = "";
    socket.emit("user-send-message", k);
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  $(document).on("click", ".btn-warning", function () {
    var vt1 = $(this).attr("value");
    var ten_user = document.getElementById("text_dk").value;

    if (ten_user == "") {
      document.getElementById("b11").value = vt1;
      $("#myModal10").modal();
    }
  });
  $("#b12").click(function () {
    var danh_sach = document.getElementById("id5").value,
      html = "ĐỐI THỦ ĐANG ĐỢI<br>";
    for (var i = 0; i < danh_sach.length; i++) {
      html += danh_sach[i] + "<br>";
    }
    $("#id5").html(html);
  });

  $("#btnbatdau").click(function () {
    var ban = document.getElementById("b11").value;
    var songuoi1 = document.getElementById("b10").value;
    var songuoi = songuoi1.B;
    var dem = 0;
    if (songuoi != []) {
      for (var i = 0; i < songuoi.length; i++) {
        if (songuoi[i].BAN == ban) {
          dem++;
        }
      }
    }

    if (dem > 1 && dem < 5) {
      $("#btnbatdau").hide();
      socket.emit("user-send-phatbai", "batdau");
      socket.emit("user-send-xem-van-dau", "1");
    } else if (dem == 1) {
      alert("Bàn chưa đủ người");
    } else {
      alert("Bàn đã đủ người");
    }
  });
  $("#btntieptuc").click(function () {
    var ban = document.getElementById("b11").value;
    var songuoi1 = document.getElementById("b10").value;
    var songuoi = songuoi1.B;
    var dem = 0;
    for (var i = 0; i < songuoi.length; i++) {
      if (songuoi[i].BAN == ban) {
        dem++;
      }
    }
    if (dem > 1 && dem < 5) {
      $("#btntieptuc").hide();

      socket.emit("user-send-phatbai");
      socket.emit("user-send-xem-van-dau", "1");
    } else if (dem == 1) {
      alert("Bàn chưa đủ người");
    } else {
      alert("Bàn đã đủ người");
    }
  });
  $("#dang_ky").click(function () {
    var ten_user = document.getElementById("text_dk").value;
    function check_name(a) {
      var t = 0;
      if (
        a.indexOf("@") >= 0 ||
        a.indexOf("%") >= 0 ||
        a.indexOf("#") >= 0 ||
        a.indexOf(" ") >= 0
      ) {
        t = 1;
      }
      return t;
    }
    if (check_name(ten_user) == 1) {
      document.getElementById("text_dk").value = "";
      alert("Tên không được chứa ký tự @, #, %, khoảng cách");
    } else if (ten_user != "") {
      document.getElementById("dong_1").click();
      function _xem1(a, b) {
        var dem = "";

        for (var i = 0; i < a.length; i++) {
          if (a[i].BAN == b) {
            dem = a[i].T_S1;
            break;
          }
        }

        return dem;
      }
      function _xem2(a, b) {
        var dem = 0;

        for (var i = 0; i < a.length; i++) {
          if (a[i].BAN == b) dem++;
        }

        return dem;
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

      var ten_user = document.getElementById("text_dk").value;
      var vt1 = document.getElementById("b11").value;
      var py = document.getElementById("b10").value;
      var array1 = py.B;
      var dem = 0;
      for (var i = 0; i < array1.length; i++) {
        if (array1[i].BAN == vt1) {
          dem++;
        }
      }
      if (dem < 5) {
        if (_xem1(py.A, vt1) == "off" && _xem2(py.B, vt1) < 4) {
          $(".btn-warning").hide();
          socket.emit("client-send-ban", { ban: vt1, ten: ten_user });
          socket.emit("user-send-batdau");
          socket.emit("user-send-ban", vt1);

          $("#boxContent").html(
            "<h4 style='color:red;  padding:5px; '>" +
              "Bàn:" +
              vt1.substring(5, 3) +
              "</h4>"
          );
          document.getElementById("b11").value = vt1;
        } else if (_xem1(py.A, vt1) == "" && _xem2(py.B, vt1) < 4) {
          $(".btn-warning").hide();
          socket.emit("client-send-ban", { ban: vt1, ten: ten_user });
          socket.emit("user-send-batdau");
          socket.emit("user-send-ban", vt1);

          $("#boxContent").html(
            "<h4 style='color:red;  padding:5px; '>" +
              "Bàn:" +
              vt1.substring(5, 3) +
              "</h4>"
          );
          document.getElementById("b11").value = vt1;
        } else {
          $(".btn-warning").hide();
          document.getElementById("b11a").value = chuyen_ban_lon(vt1);

          socket.emit("user-send-ten-ban-tam-thoi", {
            ban: vt1,
            ten: ten_user,
          });

          var res2 = vt1.substring(5, 3);
          $("#boxContent").html(
            "<h4 style='color:red;  padding:5px; '>" + "Bàn:" + res2 + "</h4>"
          );
          socket.emit("user-send-ban", chuyen_ban_lon(vt1));
          document.getElementById("b11").value = vt1;
        }
      } else {
        alert("Số người đã đủ");
      }
    } else {
      alert("Vui lòng nhập tên!");
    }
  });
  $("#chat_1").click(function () {
    var nd_chat = document.getElementById("nd-chat").value;
    var ban = document.getElementById("b11").value;
    var ten_user = document.getElementById("text_dk").value;
    if (parseInt(ban.substring(3)) > 49) {
      ban = chuyen_ban_nho(ban);
    }
    var tong = { ban: ban, ten: ten_user, nd: nd_chat };
    $("#nd-chat").html("");
    document.getElementById("nd-chat").value = "";
    if (nd_chat != "") {
      socket.emit("user-send-chat-nd-1", tong);
    } else {
      $("#nd-chat").html("");
      document.getElementById("nd-chat").value = "";
    }
  });
  $("#btnchoingay").click(function () {
    function _xem2(a, b) {
      var dem = 0;
      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) dem++;
      }
      return dem;
    }
    function _xem1(a, b) {
      var dem = "";

      for (var i = 0; i < a.length; i++) {
        if (a[i].BAN == b) dem = a[i].T_S1;
        break;
      }
      return dem;
    }
    var ten_user = document.getElementById("text_dk").value;
    var ban2 = document.getElementById("b11").value;
    var py = document.getElementById("b10").value;
    ///////////////////////////////////////////////////
    var array1 = $("#b3").val();

    if (
      _xem2(py.B, ban2) > 0 &&
      _xem2(py.B, ban2) < 4 &&
      _xem1(py.A, ban2) == "off"
    ) {
      $("#btnchoingay").hide();
      socket.emit("user-send-roi-ban-tam", ban2);
      socket.emit("client-send-ban", { ban: ban2, ten: ten_user });
      socket.emit("user-send-batdau");
      socket.emit("user-send-ban", ban2);
      $(".btn-warning").hide();
      $("#boxContent").html(
        "<h4 style='color:red;  padding:5px; '>" +
          "Bàn:" +
          ban2.substring(5, 3) +
          "</h4>"
      );
      $("#btnchoingay").hide();
    } else if (_xem2(py.B, ban2) == 1) {
      alert("Bàn chưa đủ người");
    } else {
      alert("Bàn đã đủ người");
    }
  });
});
