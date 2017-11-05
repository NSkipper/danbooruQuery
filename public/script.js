new Vue({
    el: '#app',
    data: {
        queryResults: [],
        imgLinks: [],
        mainIMGLinks: '',
        mainIMGArtistName: '',
        selectedTag: '',
        newTagAdded: false,
        baseURL: 'https://danbooru.donmai.us/posts.json?login=Skipperno1&api_key=biY49xTSc6ZGnGfSPz_J0-5ei5j03Qs467QDLd0s350&',
        desiredTags: 'tags=landscape',
        ignoredTags: '',
        numberOfItemRetrieved: '&limit=15',

        jsonURL:''
    },
    //calling the json
    methods: {
        fetchData: function () {           
            //var baseURL = "https://danbooru.donmai.us/posts.json?login=Skipperno1&api_key=biY49xTSc6ZGnGfSPz_J0-5ei5j03Qs467QDLd0s350&";
            //make your tag here
            //var userFilter = this.selectedTag;
            //var desiredTags = "tags=landscape";
            //var ignoredTags = "";
            //var numberOfItemRetrieved = "&limit=15";
            //API return numberOfItemRetrieved number of item, with the tag as defined                      
            var self = this;
            console.log(this.jsonURL);
            axios.get(this.jsonURL)
                .then(function (response) {
                    self.queryResults = response.data;
                    self.addLinks();
                })
                .catch(function (error) {
                    console.log(error);
                });

            //console.log(self.queryResults);

        },
        addLinks: function () {
            var self = this;            
            for (var i = 0; i < this.queryResults.length; i++) {
                //console.log(this.queryResults[i]);
                var danbooruBaseURL = "https://danbooru.donmai.us";
                //var mule = self.queryResults[i].file_url;
                //The url returned from the json is only partial, and need to be appened to the domain name
                if (!this.newTagAdded) {
                    var finalPreviewLink = danbooruBaseURL.concat(this.queryResults[i].preview_file_url);
                    var finalNormalLink = danbooruBaseURL.concat(this.queryResults[i].large_file_url);
                    this.imgLinks.push({
                        finalPreviewLink: finalPreviewLink,
                        finalNormalLink: finalNormalLink,
                        imageArtistName: this.queryResults[i].tag_string_artist
                    });
                }


                if (this.newTagAdded) {
                    var finalPreviewLink = danbooruBaseURL.concat(this.queryResults[i].preview_file_url);
                    var finalNormalLink = danbooruBaseURL.concat(this.queryResults[i].large_file_url);
                    //used when the combobox get updated
                    var updatedLinks = [];
                    updatedLinks.push({
                        finalPreviewLink: finalPreviewLink,
                        finalNormalLink: finalNormalLink,
                        imageArtistName: this.queryResults[i].tag_string_artist
                    });
                    this.imgLinks = updatedLinks;
                }
            }
        
            this.mainIMGLinks = this.imgLinks[0].finalNormalLink;
            this.mainIMGArtistName = this.imgLinks[0].imageArtistName;
        },

        addNewTag: function () {
            this.jsonURL = this.baseURL.concat(this.desiredTags)
                .concat(this.ignoredTags)
                .concat(this.numberOfItemRetrieved)
                .concat("&tags=").concat(this.selectedTag);
            this.fetchData();
        }
    },
    computed: {

        availableTags: function () {
            var self = this;
            var mules = [];
            var result = [];
            //predefining tags to have something to work with.
            
            mules.push({ tag: "hill" });

            mules = _.sortBy(mules, 'tag')
            result = _.uniq(_.map(mules, 'tag'));
            return result;
        }
    },
    //calling the method which load the json file at the loading of the page
    created: function () {
        this.jsonURL = this.baseURL.concat(this.desiredTags)
            .concat(this.ignoredTags)
            .concat(this.numberOfItemRetrieved)
            //.concat("&").concat(this.selectedTag);
        this.fetchData();
        //this.addLinks();
    },
    //no idea what to do here
    updated: function () {
        console.log(this.jsonURL);
        //this.fetchData();
    }
})