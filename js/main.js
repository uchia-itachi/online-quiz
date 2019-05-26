function signpop() {
  document.getElementById("sign-up").style.display="block";
  document.getElementById("sign-up").style.width="50%";
  document.getElementById("sign-in").style.width="50%";

  var x = document.getElementById("form-container");
  var y=document.getElementById("quizdetails");
  var z=document.getElementById("popup");

  if (getComputedStyle(x, null).display === "none") {
    document.getElementById("subject").style.display="none";
    document.getElementById("sign-up-form").action = "/signup";
    document.getElementById("sign-in-form").action = "/login";
    y.style.width = "65%";
    y.children[0].style.padding = "10px 120px";
    y.children[1].style.padding = "10px 120px";
    y.children[2].style.padding = "10px 120px";
    z.style.width = "35%";
    x.style.display = "block";

  } else {
    if(getComputedStyle(document.getElementById("subject"), null).display=="none"){
      y.style.width = "100%";
      y.children[0].style.padding = "10px 420px";
      y.children[1].style.padding = "10px 420px";
      y.children[2].style.padding = "10px 420px";
      z.style.width = "0%";
      x.style.display = "none";
    }
    else{
      document.getElementById("subject").style.display="none";
      document.getElementById("sign-up-form").action = "/signup";
      document.getElementById("sign-in-form").action = "/login";
    }

  }
}
function facualtypop() {
document.getElementById("sign-up").style.display="block";
document.getElementById("sign-up").style.width="50%";
document.getElementById("sign-in").style.width="50%";

  var x = document.getElementById("form-container");
  var y=document.getElementById("quizdetails");
  var z=document.getElementById("popup");
  if (getComputedStyle(x, null).display === "none") {
    document.getElementById("subject").style.display="block";
    document.getElementById("sign-up-form").action = "/fsignup";
    document.getElementById("sign-in-form").action = "/flogin";
    y.style.width = "65%";
    y.children[0].style.padding = "10px 120px";
    y.children[1].style.padding = "10px 120px";
    y.children[2].style.padding = "10px 120px";
    z.style.width = "35%";
    x.style.display = "block";
    console.log("1");

  } else {
    if(getComputedStyle(document.getElementById("subject"), null).display !="block"){
    y.style.width = "100%";
    y.children[0].style.padding = "10px 420px";
    y.children[1].style.padding = "10px 420px";
    y.children[2].style.padding = "10px 420px";
        z.style.width = "0%";
    x.style.display = "none";
    console.log("2");
  }
  else{
    document.getElementById("subject").style.display="block";
    document.getElementById("sign-up-form").action = "/fsignup";
    document.getElementById("sign-in-form").action = "/flogin";
    console.log("3");
  }
  }
}

function adminpop() {
document.getElementById("sign-up").style.display="none";
document.getElementById("sign-up").style.width="0%";
document.getElementById("sign-in").style.width="100%";

clickin();

  var x = document.getElementById("form-container");
  var y=document.getElementById("quizdetails");
  var z=document.getElementById("popup");

  if (getComputedStyle(x, null).display === "none") {
    document.getElementById("subject").style.display="block";
    document.getElementById("sign-in-form").action = "/alogin";
    y.style.width = "65%";
    y.children[0].style.padding = "10px 120px";
    y.children[1].style.padding = "10px 120px";
    y.children[2].style.padding = "10px 120px";
        z.style.width = "35%";
    x.style.display = "block";

  } else {
    if(getComputedStyle(document.getElementById("subject"), null).display !="none"){
    y.style.width = "100%";
    y.children[0].style.padding = "10px 420px";
    y.children[1].style.padding = "10px 420px";
    y.children[2].style.padding = "10px 420px";
        z.style.width = "0%";
    x.style.display = "none";
  }
  else{
    document.getElementById("subject").style.display="block";
    document.getElementById("sign-in-form").action = "/alogin";
  }
  }
}

function clickup()
        {
            document.getElementById("sign-up-form").style.display = "block";
            document.getElementById("sign-in").style.borderBottom = "0.2px solid #cebebe";
            document.getElementById("sign-up").style.backgroundColor = "white";
            document.getElementById("sign-in").style.backgroundColor = "#fdf3f3";
            document.getElementById("sign-up").style.borderBottom = "none";
            document.getElementById("sign-in-form").style.display = "none";
        }
        function clickin()
        {
            document.getElementById("sign-in-form").style.display = "block";
            document.getElementById("sign-up").style.borderBottom = "0.2px solid #cebebe";
            document.getElementById("sign-in").style.backgroundColor = "white";
            document.getElementById("sign-up").style.backgroundColor = "#fdf3f3";
            document.getElementById("sign-in").style.borderBottom = "none";
            document.getElementById("sign-up-form").style.display = "none";
            //document.getElementById("form-container").style.height=40%;

        }
