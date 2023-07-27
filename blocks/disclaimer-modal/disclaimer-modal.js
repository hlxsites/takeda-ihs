export default async function decorate(block) {
const modalContainer = document.querySelector('.disclaimer-modal-container');
const modal = document.querySelector('.disclaimer-modal');
modal.children[0].classList.add('modal-title');
const modalTitle = document.querySelector('.modal-title');
modalTitle.nextElementSibling.classList.add('modal-body-content');
const modalBodyText = document.querySelector('.modal-body-content');
modalBodyText.nextElementSibling.classList.add('modal-button-wrapper');
const modalButtonWrapper = document.querySelector('.modal-button-wrapper');
modalButtonWrapper.children[0].classList.add('modal-agree-button');
modalButtonWrapper.children[1].classList.add('modal-go-button');
const acceptButn = document.querySelector('.modal-agree-button');
hcpDisclaimerCheck(document, modalContainer, acceptButn);

  }
  async function hcpDisclaimerCheck(document, modal, acceptButn) {
    const isModalAccepted = document.cookie.match(/\shcpModalDismiss=1;?/) !== null;
    const shouldShowModal = !isModalAccepted;
  
    if (shouldShowModal) {
        modal.style.display = 'block';
        acceptButn.onclick = function(){

            document.cookie += 'hcpModalDismiss=1';
            modal.style.display = 'none';
        }
      
    }
  }