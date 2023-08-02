import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const response = await fetch(`/drafts/teriyana/disclaimer-modal.plain.html`);
  const isModalAccepted = document.cookie.match(/\shcpModalDismiss=1;?/) !== null || window.location.href.indexOf("?bypassModal") > -1;
  const shouldShowModal = !isModalAccepted || (document.location.href.indexOf("?showModal") > -1);
  const modalContainer = block.parentElement.parentElement;
  
  if (response.ok && shouldShowModal) {
    modalContainer.style.display = 'block';
    const html = await response.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const modal = tmp.querySelector('.disclaimer-modal');
    const config = readBlockConfig(modal);
    block.innerHTML = `
  <div class="title"><h2>${config.title}</h2></div>
  <div class="content"><p> ${config.content}</p></div>
  <div class="button-section">
  <div class="agree"><p> ${config.agree}</p></div>
  <div class="leave"><a class="link" href=" ${config.link} "> <p>${config.leave} </p></a></div>
  </div>
  `
    const acceptButn = block.querySelector('.agree');
    acceptButn.addEventListener('click', function () {
      var CookieDate = new Date;
      CookieDate.setFullYear(CookieDate.getFullYear() +5);
      document.cookie = `hcpModalDismiss=1;path=/;myCookie=to_be_deleted;expires=${CookieDate.toUTCString()};`;
      modalContainer.style.display = 'none';
    });
   

  }
  else {
    block.parentElement.style.background = 'none';
    block.parentElement.parentElement.style.background = 'none';
    block.style.display = 'none';

  }
}
