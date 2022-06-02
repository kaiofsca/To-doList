
const Main = {

    tasks: [],
    // init inicia a coisa toda mas nao é uma palavra reservada... podia ser qualquer outra.
    init: function() {
        this.cacheSelectors() //Seleciona os elementos do HTMl e armazenar em uma variável.
        this.bindEvents() // bidEvents(conectar os eventos) responsavel por adicionar eventos de click. ****THIS**** ex: o this do chacheSelectors esta se referenciando ao pai do objeto que é o Main.
        this.getStoraged()
        this.buildTasks()
    },

    cacheSelectors: function() {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list  ')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function() {
        const self = this // "self" não é um nome reservado.

        this.$checkButtons.forEach(function(button) {
            button.onclick = self.Events.checkButton_click
        }) // para cada elemento do meu array (this.$checkButtons) eu vou aplicar essa função(começa no forEach). DICA:::: da um console.log(this) para ver qual é o contexto do this.

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function(button) {
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        this.tasks = JSON.parse(tasks) // "this.tasks" se refere ao obj la de cima e o "tasks" se refere ao const tasks a cima dele
    },

    getTaskHtml: function(task) {
        return ` 
            <li>
                <div class="check"></div>
                    <label class="task">
                        ${task}
                    </label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function() {
        let html = ''
        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    Events: {
        checkButton_click: function(e) { // "e" de evento (palavra não reservada tbm)
            const li = e.target.parentElement
            const isDone = li.classList.contains('done') // **CONTAINS** verifica se o elemento ja existe

            if (isDone) {
                li.classList.remove('done') // (remove) removeu a classe no LI 
            } else {
                li.classList.add('done') // (add) adiciono uma classe no LI 
            }
        },

        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value

            if (key === 'Enter') { // o THIS sempre que ssta em um evento muda de contexto
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = ''

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                this.cacheSelectors() // chama as funções novamente porque depois de adcionar um novo elemento HTML, ele apaga e refaz o HTMl tirando as funções.
                this.bindEvents()

                const obj = [
                    {task: value},
                    ...savedTasksObj // guarda todos os item 
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButton_click: function(e) {
            const li = e.target.parentElement
            const value = e.target.dataset['task']

            const newTasksState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            li.classList.add('removed')

            setTimeout(function() {
                li.classList.add('hidden')
            },300)
        }
    }

}

Main.init()
