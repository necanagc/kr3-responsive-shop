// Получаем модальное окно по id.
const orderDialog = document.querySelector('.order-dialog');

if (orderDialog) {
  // Получаем все кнопки заказа в карточках товаров.
  const orderButtons = document.querySelectorAll('.product-card__button');

  // Получаем кнопку закрытия модального окна.
  const closeDialogButton = document.querySelector('.order-form__actions .button--secondary');
  const selectedProductInput = document.getElementById('selected-product');

  // Перебираем все кнопки «Заказать».
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (selectedProductInput) {
        selectedProductInput.value = button.dataset.product || '';
      }

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  closeDialogButton?.addEventListener('click', () => {
    orderDialog.close();
  });

  // Получаем форму заявки.
  const orderForm = document.querySelector('.order-form');

  // Получаем сообщение об успешной отправке.
  const successMessage = document.querySelector('.success-message');

  // Обрабатываем отправку формы.
  if (orderForm && successMessage) {
    orderForm.addEventListener('submit', (event) => {
      // Отменяем стандартную отправку формы,
      // потому что backend пока не подключён.
      event.preventDefault();

      // Сбрасываем предыдущие признаки ошибок.
      const formElements = Array.from(orderForm.elements);

      formElements.forEach((element) => {
        if (element.willValidate) {
          element.removeAttribute('aria-invalid');
        }
      });

      // Проверяем встроенные HTML-ограничения формы.
      if (!orderForm.checkValidity()) {
        formElements.forEach((element) => {
          if (element.willValidate && !element.checkValidity()) {
            element.setAttribute('aria-invalid', 'true');
          }
        });

        // Показываем стандартные сообщения браузера.
        orderForm.reportValidity();
        return;
      }

      // Показываем сообщение об успешной отправке.
      successMessage.textContent = 'Заявка оформлена в демо-режиме. Данные не сохраняются и не отправляются.';
      successMessage.hidden = false;

      // Очищаем форму.
      orderForm.reset();

      // Закрываем модальное окно.
      orderDialog.close();
    });
  }
}

const purchaseOrderForm = document.querySelector('.order-page__form');
const orderSuccessMessage = document.getElementById('order-success');

if (purchaseOrderForm && orderSuccessMessage) {
  purchaseOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    orderSuccessMessage.textContent = 'Заявка принята в демо-режиме. Данные не сохраняются и не отправляются.';
    orderSuccessMessage.hidden = false;
    purchaseOrderForm.reset();
    purchaseOrderForm.elements.namedItem('quantity').value = '1';
  });

  purchaseOrderForm.addEventListener('input', () => {
    orderSuccessMessage.hidden = true;
  });
}
