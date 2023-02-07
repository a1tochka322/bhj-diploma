/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(localStorage.user, (err, response) => {
      const select = this.element.querySelector('[name="account_id"]');
      select.querySelectorAll('option').forEach(elem => {
        elem.parentNode.removeChild(elem)
      })
      response.data.forEach(account => {
        const option = document.createElement('option');
        option.innerHTML = `${account.name}`;
        option.setAttribute('value', `${account.id}`);
        select.appendChild(option);
      })
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        this.element.reset();
        let modal;
        if (this.element.closest('.modal').id === 'modal-new-expense'){
          modal =  modal = new Modal(App.getModal('newExpense').element);
        } else {
          modal = new Modal(App.getModal('newIncome').element);
        }
        modal.close();
        App.update();
      }
    })
  }
}

