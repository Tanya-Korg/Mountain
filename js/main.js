//"use strict"
//<script>
//$(form).on("submit", function(){
//	var formID  + "#" + $(this).attr("id");
//	$(formID).validate({
//		rules:{
//			name: "required",
//			phone: "required",
//			email: "required"
//		},
//		messages:{
//			name: "Enter the correct name",
//			phone: "Enter the correct phone number",
//			email: "Enter the correct E-mail"
//		}
//	});
//	if($(formID).valid()){
//		$(this).hide();
//		$(this).parebt().find(".success__form").addClass("success_show")
//	}
//	return false;
//})
//</script>



    $(document).ready(function(){
  $('.responsive').slick({
  dots: true,
  infinite: false,
//  autoplay: true,
//  autoplaySpeed: 2000,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
    });

  