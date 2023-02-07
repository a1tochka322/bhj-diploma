/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element.length === 0) {
      throw 'Пустое значение';
    } else {
      this.element = element;
    }
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.onclick = (event) => {
      event.preventDefault();
      if (event.target.classList.contains('create-account')) {
        App.getModal('createAccount').element.style.display = 'block';
      } else {
        this.onSelectAccount(event.target.closest('.account'))
      }
    };
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      this.clear();
      Account.list(User.current(), (err, response) => {
        response.data.forEach(item => {
          this.renderItem(item);
        })})
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    document.querySelectorAll('.account').forEach(elem => {
      elem.parentNode.removeChild(elem)
    })
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    if (this.element.querySelector('.active')) {
      this.element.querySelector('.active').classList.remove('active');
    }
    if (element) {
      element.classList.add('active');
      App.showPage('transactions', { account_id: element.dataset.id })
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const element = document.createElement('li');
    element.classList.add('account');
    element.dataset.id = item.id;
    element.innerHTML = `<a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
      </a>`;
    return element
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const elem = this.getAccountHTML(data);
    this.element.appendChild(elem);
  }
}
