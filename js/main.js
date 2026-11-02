const catalogProducts = {
  behringer: {
    name: 'Микшер Behringer',
    category: 'Микшер',
    price: '10 000 руб.',
    description: 'Организация сигналов для концертов и репетиций.',
    image: 'images/2rd7xauplracw0wc48kwkgg4s-2.jpg',
    imageAlt: 'Микшер Behringer',
  },
  shure: {
    name: 'Микрофон Shure',
    category: 'Микрофон',
    price: '12 000 руб.',
    description: 'Легендарный динамический микрофон для записи и выступлений.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiuOlkQvFRg10ZYWpsodNN0Nqq104lc87C_4ubjngDNvwfJYEVbi7QLcMj&s=10',
    imageAlt: 'Микрофон Shure',
  },
  'dj-controller': {
    name: 'DJ-контроллер',
    category: 'DJ-контроллер',
    price: '50 000 руб.',
    description: 'Оборудование для вечеринок и DJ-сетов.',
    image: 'https://bxuiiaeu1l.a.trbcdn.net/cjc/tnt/tdg/bw4/8ss/w08/ow8/sg8/cjctnttdgbw48ssw08ow8sg80.jpg',
    imageAlt: 'DJ-контроллер',
  },
};

const productDetail = document.getElementById('product-detail');

if (productDetail) {
  const productId = new URLSearchParams(window.location.search).get('product') || 'behringer';
  const product = catalogProducts[productId];

  if (!product) {
    productDetail.hidden = true;
    document.getElementById('product-breadcrumb').textContent = 'Товар';
    document.getElementById('product-not-found').hidden = false;
  } else {
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('product-breadcrumb').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.imageAlt;
    document.getElementById('product-order-link').href =
      `orders.html?product=${encodeURIComponent(productId)}`;
    document.title = `${product.name} — МузТорг Жуковский`;

    const specifications = document.getElementById('product-specifications');
    const rows = [
      ['Товар', product.name],
      ['Категория', product.category],
      ['Цена', product.price],
      ['Описание', product.description],
    ].map(([label, value]) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      const cell = document.createElement('td');

      heading.scope = 'row';
      heading.textContent = label;
      cell.textContent = value;
      row.append(heading, cell);
      return row;
    });

    specifications.replaceChildren(...rows);
  }
}

const orderProductSelect = document.getElementById('order-product');
const requestedProductId = new URLSearchParams(window.location.search).get('product');

if (
  orderProductSelect &&
  requestedProductId &&
  Object.hasOwn(catalogProducts, requestedProductId)
) {
  orderProductSelect.value = requestedProductId;
}

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
