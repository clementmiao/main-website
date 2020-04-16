Vue.component('action-item', {
    props: ['action'],
    template: '<li>{{ action.text }}</li>'
});

var actions = [
    { id: 0, text: 'Delete deal' },
    { id: 1, text: 'Close deal' },
    { id: 2, text: 'Re-open deal' },
];

var app = new Vue({ 
    el: '#app',
    data: {
        seen: false,
        search: '',
        actionsList: actions,
    },
    watch: {
        search: function (input) {
            this.actionsList = actions.filter(action => action.text.toLowerCase().includes(input.toLowerCase()));
        },
    },
     mounted() {
        this._keyListener = function(e) {
            if (e.key === " " && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.seen = !this.seen;
                if (this.seen === true) {
                    this.$nextTick(function() {
                        this.$refs.search.focus()
                    })
                } else {
                    this.search = ''
                }
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    },
});
