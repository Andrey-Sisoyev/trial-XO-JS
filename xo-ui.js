jQuery(function($){

    var data = [
       {firstName: "Anatoly", lastName: "Ressin", salary: 0},
       {firstName: "Vasily", lastName: "Pupkin", salary: 0},
       {firstName: "Vasily I", lastName: "Pupkin", salary: 0},
       {firstName: "Vasily II", lastName: "The Great", salary: 10000}
    ];

    var $t = $("#templates");
    var tpl = {
        personList : $t.find(".person-list.template"),
        person: $t.find(".person.template")
    }

    $t.find(".template").removeClass("template").remove();

    function makePersonList(personList) {
        var $e = tpl.personList.clone();
        personList.forEach(function(p){
            $e.append(makePerson(p));
        })
        //$e.append(personList.map(makePerson))
        return $e; 
    }

    function makePerson(person){
        var $e = tpl.person.clone();
        $e.find('.firstName').text(person.firstName);
        $e.find('.lastName').text(person.lastName);
        $e.css({
            backgroundColor: '#F0F0F0'
        }).mouseenter(function(){
            $e.stop().animate({
                'width':'500',
                'height':'50',
                'backgroundColor':'red'
            });    
        }).mouseleave(function(){
            $e.stop().animate({
                'width':'200',
                'height':'20',
                'backgroundColor':'blue'
            });
        });
        return $e;
    }



    $("body").append(makePersonList(data));


})