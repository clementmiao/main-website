var actions = [{
        id: 0,
        text: 'Delete deal',
        keyBinding: 'a',
    },
    {
        id: 1,
        text: 'Close deal',
        keyBinding: 'b',
    },
    {
        id: 2,
        text: 'Re-open deal',
        keyBinding: 'c',
    },
    {
        id: 3,
        text: 'eat potatoes',
        keyBinding: 'd',
    },
    {
        id: 4,
        text: 'cook potatoes',
        keyBinding: 'e',
    },
    {
        id: 5,
        text: 'buy potatoes',
        keyBinding: 'f',
    },
    {
        id: 6,
        text: 'fly a kite',
        keyBinding: 'g',
    },
    {
        id: 7,
        text: 'buy a bike',
        keyBinding: 'h',
    },
    {
        id: 8,
        text: 'party time',
        keyBinding: 'i',
    },
];

var app = new Vue({
    el: '#app',
    data: {
        current: 0,
        open: false,
        seen: false,
        value: '',
        actionsList: actions,
    },
    computed: {
        matches: function () {
            return this.actionsList.filter(obj => {
                return obj.text.indexOf(this.value) >= 0
            })
        },
        openSugggestion: function () {
            return this.value !== '' && this.matches.length !== 0 && this.open === true && this.seen === true
        },

    },
    methods: {
        updateValue: function (value) {
            if (this.open === value) {
                this.open = true;
                this.current = 0
            }
            this.$emit('input', value);
            this.value = value
        },
        enter: function () {
            const selectedAction = this.matches[this.current];
            console.log(selectedAction.text);
            this.open = false;
            this.seen = false;
        },
        up: function () {
            if (this.current > 0) {
                this.current--
            }
        },
        down: function () {
            if (this.current < this.matches.length - 1) {
                this.current++
            }
        },
        isActive: function (index) {
            return index === this.current
        },
        suggestionClick(index) {
            const selectedAction = this.matches[index];
            console.log(selectedAction.text);
            this.open = false;
            this.seen = false;
        },
    },
    mounted() {
        this._keyListener = function (e) {
            if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.seen = !this.seen
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                this.seen = false
            }
            if (this.seen === true) {
                this.$nextTick(function () {
                    this.$refs.search.focus()
                })
            } else {
                this.value = ''
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    },
});