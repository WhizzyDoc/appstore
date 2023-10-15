//localStorage.setItem('username', 'Neeyarh');
//localStorage.setItem('password', 'tostini102');
const credentials = btoa(localStorage.username + ":" + localStorage.password);

$(document).ready(function() {
    getTheme();
    // check if user is logged in
    if(localStorage.username && localStorage.password) {
        $('#user-state').text('Logout').data('id', 'logout');
    }
    else {
        $('#user-state').text('Login').data('id', 'login');
    }
    // switch login/logout
    $('.switch-login').click(function() {
        var state = $('#user-state').data('id');
        if(state == 'login') {location.href = 'login.html'}
        else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            $('#user-state').text('Login').data('id', 'login');
            swal("Success", "You have been logged out", "success");
            /*
            swal({
                title: "Are you sure you want to logout?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
            }, function(isConfirm) {
                    if(isConfirm) {
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');
                        $('#user-state').text('Login').data('id', 'login');
                        swal("Success", "You have been logged out", "success");
                    }
                }
            )
            */
        }
    })
    
    // close app detail view
    $('.close-app-det').click(function() {
        $('.app-det-con').removeClass('active');
    });
    
    
    /* System Apps Function */
        function openApp(elem) {
            var app_link = elem.data('id');
            var app_name = elem.data('name');
            $('.app-container').addClass('active');
            $('.app-title').html(app_name);
            link = "app/" + app_link + "/index.html";
            $('#app-content').attr('src', link);
        }
        
        // open system app
        $('.app-link').click(function(e) {
            e.preventDefault();
            openApp($(this));
        });
        // close system app
        $('.close-app').click(function() {
            $('.app-container').removeClass('active');
        });

        /* App Store functions */
        // More Apps section
        $('.openmenu').click(function(e) {
            e.preventDefault();
            // open menu container
            $('.menu-container').addClass('active');
            loadMenu();
        });
        // filter by category
        $('#by-category').on('change', function() {
            cat_val = $('#by-category').val();
            type_val = $('#by-type').val();
            $('.more-app').empty().html(`<div class="loader"></div>`);
            var url = ''
            if(type_val == 'all') {
                if(cat_val == 'all') {
                    url = 'https://riganapi.pythonanywhere.com/api/apps/get_all_apps/';
                }
                else {
                    url = `https://riganapi.pythonanywhere.com/api/categories/${cat_val}/get_apps/`;
                }
            }
            else {
                if(cat_val == 'all') {
                    url = `https://riganapi.pythonanywhere.com/api/types/${type_val}/get_apps/`;
                }
                else {
                    url = `https://riganapi.pythonanywhere.com/api/apps/filter_category_type/?category_id=${cat_val}&type_id=${type_val}`
                }
            }
            getMoreApps(url);
        })
        // filter by type
        $('#by-type').on('change', function() {
            cat_val = $('#by-category').val();
            type_val = $('#by-type').val();
            $('.more-app').empty().html(`<div class="loader"></div>`);
            var url = ''
            if(cat_val == 'all') {
                if(type_val == 'all') {
                    url = 'https://riganapi.pythonanywhere.com/api/apps/get_all_apps/';
                }
                else {
                    url = `https://riganapi.pythonanywhere.com/api/types/${type_val}/get_apps/`;
                }
            }
            else {
                if(type_val == 'all') {
                    url = `https://riganapi.pythonanywhere.com/api/categories/${cat_val}/get_apps/`;
                }
                else {
                    url = `https://riganapi.pythonanywhere.com/api/apps/filter_category_type/?category_id=${cat_val}&type_id=${type_val}`
                }
            }
            getMoreApps(url);
        });
        // filter by search
        $('#search-btn').click(function(e) {
            e.preventDefault();
            var val = $('#app-search').val();
            if(val == '') {
                swal("Oops!", "Search field cannot be empty", "warning");
                return;
            }
            $('.more-app').empty().html(`<div class="loader"></div>`);
            var url = `https://riganapi.pythonanywhere.com/api/apps/search/?query=${val}`;
            getMoreApps(url);
        })
        $('.close-menu').click(function() {
            $('.menu-container').removeClass('active');
        });

        // search feature
        $('#search').on('input', function () {
            if($(this).val() == '') {
                $('#search-content').hide();
            }
            else {
                $('#search-content').show();
                var r = $(this).val();
                //alert(s);
                $('#search-content').empty();
                fetch('./static/js/search.json')
                .then(res => {return res.json()})
                .then(data => {
                    console.log(data);
                    data = data.result;
                    for(s in data) {
                        var temp = `<a class="search-item" href="#" data-name="${data[s].title}" data-id="${data[s].link}">${data[s].title}</a>`;
                        if(data[s].slug.includes(r.toLowerCase()) == true) {
                            $('#search-content').append(temp);
                        }
                    }
                    $('.search-item').click(function(e) {
                        e.preventDefault();
                        openApp($(this));
                        $('#search').val('');
                        $('#search-content').hide();

                    })
                })
                .catch(error => {
                    swal("Oops", "Error occured!", "error");
                    console.log("error: " + error);
                })
            }
        })

        // When the user clicks on the button, open the modal
    $('.review-btn').click(function() {
        $('.rate-container').css('display', 'flex');
        $('.star-widget').css('display', 'block');
    });
    $('.edit').click(function() {
        $('.rate-container').css('display', 'none');
    });

  
  // When the user clicks on <span> (x), close the modal
  // posting comment
  $('#post-rate').click(function(e) {
    e.preventDefault();
    var comment_url = "https://riganapi.pythonanywhere.com/api/apps/post_comment/";
    var name = $('#user-name').val();
    var comment = $('#user-comment').val();
    var rating = $("input[name=rate]:checked").val();
    var id = $('#user-rating').val();
    //alert(rating + ":" + typeof(rating));
    if(name == '' || comment == '') {
        swal("Oops", "Kindly fill in all details", "warning");
        return;
    }
    const formData = JSON.stringify({
        name: name,
        comment: comment,
        id: parseInt(id),
        rating: parseInt(rating),
    });
    $(this).html(`<div class="loader"></div>`).attr('disabled', true);

    fetch(comment_url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: formData,
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json() // convert response to json
    })
    .then(data => {
        console.log(data);
        if(data['status'] == 'success') {
            // success function
            swal("Success", data['message'], "success");
            comment = data['data'];
            var date = new Date(comment.created).toLocaleDateString();
            var temp = `<div class="comm-con" id="${comment.name}_c">
                        <div class="com comment">
                            <h4 style="text-transform:uppercase;">${comment.name}</h4>
                            <p class="star-no" id="${comment.name}">
                                &nbsp;&nbsp; 
                                ${date}
                            </p>
                            <p>${comment.comment}</p>
                        </div>

                    </div>`;
            $('.comment-con').prepend(temp);

            var id = "#" + comment.name;
            //console.log(typeof(id));
            
            var remaining = parseInt(5 - parseInt(comment.star));
            for(var i=0; i < remaining; i++) {
                var temp3 = `<span class="fa fa-star"></span>`;
                $(id).prepend(temp3);
            }
            for(var i=0; i < comment.star; i++) {
                var temp2 = `<span class="fa fa-star checked"></span>`;
                $(id).prepend(temp2);
            }
            $('#user-name').val('');
            $('#user-comment').val('');
        }
        else {
            swal("Error", data['message'], "error");
        }
        $('#post-rate').html(`Post`).attr('disabled', false);
        $('.star-widget').css('display', 'none');
        $('.post').css('display', 'block');
    })
    .catch(error => {
        $('#post-rate').html(`Post`).attr('disabled', false);
        swal("Oops", "Error occured!", "error");
        console.error("error: " + error);
    });

    
    });

    
    
    $('.user-profile').click(function(e) {
        if(localStorage.username && localStorage.password) {
            //swal("success", "you are logged in", "success");
            e.preventDefault();
            // open profile container
            $('.profile-container').addClass('active');
            loadProfile();
        }
        else {
            swal("Oops", "Kindly login to continue", "warning");
            location.href = 'login.html';
        }
    });
    $('.close-profile').click(function() {
        $('.profile-container').removeClass('active');
    });

    $('#submit-profile').click(function(e) {
        e.preventDefault();
        if(!localStorage.username || !localStorage.password) {
            swal("error", "Sorry, you are logged out at this moment, kindly log back in to continue", "error");
            location.href = 'login.html';
            return;
        }
        var url = 'https://riganapi.pythonanywhere.com/api/users/update_profile/';
        const formData = JSON.stringify({
            username: localStorage.username,
            firstName: $('#fname').val(),
            lastName: $('#lname').val(),
            email: $('#email').val(),
            phoneNumber: $('#phone').val(),
            pin: $('#pin').val(),
        });
        $(this).html(`<div class="loader"></div>`).attr('disabled', true);
        fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              },
            body: formData,
        })
        .then(response => {
            if(!response.ok) {
               throw new Error('Network response was not ok');
            }
             return response.json() // convert response to json
        })
        .then(data => {
            console.log(data);
            if(data['status'] == 'success') {
                swal("Success", data['message'], "success");
                loadProfile();
            }
            else if(data['status'] == 'error') {
                swal("Error", data['message'], "error");
            }
            $('#submit-profile').html('Save Profile').attr('disabled', false);
        })
        .catch(error => {
            console.log(error);
            swal("Oops", "Error occured!", "error");
        })
    })

    // refresh functions
    $('#profile-refresh').click(function(e) {
        e.preventDefault();
        loadProfile();
    })
    $('#app-refresh').click(function(e) {
        e.preventDefault();
        loadMenu();
    })
    $('.app-det-refesh').click(function(e) {
        e.preventDefault();
        getAppDetail($(this));
    })
    
})

function readFile() {
    var reader = new FileReader();
    var file = document.querySelector('#dp').files[0];
    reader.onload = function(e) {
        document.querySelector('#dp-image').src = e.target.result;
    }
    reader.readAsDataURL(file);
    document.querySelector('.profile-btn').style.display = "inline";
}

function getTheme() {
    var theme = localStorage.getItem('data-theme');
    if(theme=='light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    else if(theme=='') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    else if(theme=='dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById("checkbox").checked = true;
    }
}

function toggle(a) {
    if(a.checkbox.checked==true) {
        document.documentElement.classList.add('transition');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('data-theme', 'dark');
    }
    else if(a.checkbox.checked==false) {
        document.documentElement.classList.add('transition');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('data-theme', 'light');
    }
}

function dropDown(elem) {
    elem.siblings('.dropdown-content').toggleClass('show');
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.fa-ellipsis-v')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

