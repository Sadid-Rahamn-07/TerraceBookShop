const { createApp } = Vue;
createApp({
    data() {
        return {
            start_review: false,
            submit_review: false,
            review_mode: 'write',
            books: [],
            reviews: [],
            reviewData: {
                purchaseID: 0,
                review_string: '',
                ratings: 0
            }
        };
    },
    mounted() {
        fetch(`users/show_purchase`, { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error("Book not found");
                return res.json();
            })
            .then((books) => {
                this.books = books;
            })
            .catch((err) => {
                console.error("Can't load purchased books", err);
                alert("Unable to load book data.");
            });

        fetch('users/get_reviews', { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error("No reviews yet!");
                return res.json();
            })
            .then((reviews) => {
                this.reviews = reviews;
            })
            .catch((err) => {
                console.error("Can't load reviews books maybe there is no reviews yet", err);
                alert("Unable to load reviews");
            });
    },

    methods: {
        openReview(purchaseID) {
            this.review_mode = 'write';
            this.reviewData.purchaseID = purchaseID;
            this.start_review = true;
        },

        cancelReview() {
            this.reviewData.purchaseID = 0;
            this.reviewData.review_string = '';
            this.reviewData.ratings = 0;
            this.start_review = false;
        },

        submitReview() {
            const data = {
                purchaseID: this.reviewData.purchaseID,
                review_string: this.reviewData.review_string,
                ratings: this.reviewData.ratings
            };

            fetch('/users/post_reviews', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to submit review');
                    return res.json();
                })
                .catch((err) => {
                    console.log(err);
                    console.error('Error submitting review:', err);
                    alert('There was an error submitting your review.');
                });

            this.start_review = false;
            alert('Submitted a review');
            location.reload();
        },

        hasReview(purchaseID) {
            return this.reviews.some((r) => r.purchase_id === purchaseID);
        },

        showReview(purchaseID) {
            const existing = this.reviews.find((r) => r.purchase_id === purchaseID);

            if (existing) {
                this.review_mode = 'read';
                this.reviewData.purchaseID = purchaseID;
                this.reviewData.review_string = existing.review_text;
                this.reviewData.ratings = existing.review_rating;
                this.start_review = true;
            }
        }
    }
}).mount('.main_body');

