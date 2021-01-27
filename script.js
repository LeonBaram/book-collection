$(function() {

    //jquery selector cache
    const $form = $('form');
    const $sortBy = $('#sort-by');
    const $formLabel = $('#form-label');
    const $bookshelf = $('.bookshelf');

    //internal book object array
    let books = [];
    
    //book object constructor
    function Book(title, author) {
        this.title = title;
        this.author = author;
        this.timestamp = Date.now();
    }

    //adds book to html
    //isAppend controls whether to append or prepend
    function addBook(book, isAppend = false) {
        const literalLi = 
        `<li class="book">
            <span class="title">${book.title}</span>
            <span class="author">By ${book.author}</span>
        </li>`;

        if (isAppend) {
            $bookshelf.append(literalLi);    
        } else {
            $bookshelf.prepend(literalLi);
        }
    }

    //current arrangement of books (title/author/timestamp)
    //default: timestamp
    let arrangement = 'timestamp';

    //sorts books using built-in JS sort() function
    //provides comparison functions for numerical (timestamp) and alphabetical (title/author) sorts
    function sortBooks(property = 'timestamp') {
        switch(property) {
            case 'title':
            case 'author':
                books.sort(function(bookA, bookB) {
                    const propA = bookA[property];
                    const propB = bookB[property];
                    return (propA < propB) ? -1:
                           (propA > propB) ?  1: 
                                              0;
                });
                break;
            default:
                books.sort(function(bookA, bookB) {
                    return bookB.timestamp - bookA.timestamp;
                });
                break;
        }

        //deletes existing li's
        $bookshelf.empty();

        //repopulates bookshelf
        for (const book of books) {
            addBook(book, true);
        }
    }

    function toggleForm() {
        $form.fadeToggle();
        $form.trigger('reset');
        $formLabel.text(
            ($formLabel.text()==='Add New Book')?
            'Cancel' : 'Add New Book'
        );
    }

    $form.hide();

    $sortBy.on('change', function() {
        arrangement = $sortBy.val();
        sortBooks(arrangement);
    });

    $formLabel.on('click', function() {
        toggleForm();
    });

    $form.on('submit', function(event) {
        event.preventDefault();

        const title = $('#title').val();
        const author = $('#author').val();

        let alertStr = "";
        if (title === "") {
            alertStr += "Please provide a title.\n";
        }
        if (author === "") {
            alertStr += "Please provide the name of the author.";
        }
        if (title === "" || author === "") {
            alert(alertStr);
            return;
        }

        const book = new Book(title, author);
        books.push(book);
        addBook(book);
        sortBooks(arrangement);

        toggleForm();
    });
});