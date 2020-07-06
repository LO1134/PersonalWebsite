saveHTML_button = document.getElementById("saveHTMLButton");

saveHTML_button.addEventListener("click", () => {
  console.log("button save html pressed");
  const htmlSource = document.documentElement.outerHTML;
  console.log(htmlSource);
});
