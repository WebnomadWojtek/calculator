function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function getSelectedCurrency() {
    if ($('#eur').is(':checked')) {
        return 'EUR';
    } else if ($('#gbp').is(':checked')) {
        return 'GBP';
    } else {
        return 'USD';
    }
}
function constructUrlWithParameters() {
    var ticketVolume = $('#ticketVolume').val() || '';
    var agents = $('#agents').val() || '';
    var salaryAgents = $('#salary_agents').val() || '';
    var chatsNum = $('#chats-num').val() || '';
    var emailsNum = $('#emails-num').val() || '';
    var callsNum = $('#calls-num').val() || '';
 var currency = getSelectedCurrency(); 

  var queryParams = $.param({
        'ticketVolume': ticketVolume,
        'agents': agents,
        'salaryAgents': salaryAgents,
        'chatsNum': chatsNum,
        'emailsNum': emailsNum,
        'callsNum': callsNum,
        'currency': currency
    });

    var baseUrl = window.location.href.split('?')[0].split('#')[0];
    var hashFragment = window.location.hash;

    return baseUrl + '?' + queryParams + hashFragment;
}


$(document).ready(function() {
  function loadCurrencyFromParameters() {
        var currencyParam = getParameterByName('currency');
        if (currencyParam) {
            $('input[name="currency"]').prop('checked', false); 
            if (currencyParam === 'EUR') $('#eur').prop('checked', true);
            else if (currencyParam === 'GBP') $('#gbp').prop('checked', true);
        }
    }

    loadCurrencyFromParameters();
    handleCurrencyChange();

 function handleCurrencyChange() {
        var ticketCostSubtract = 0.99;
        var currencySymbol = "$"; 

        if ($('#eur').is(':checked')) {
            ticketCostSubtract = 0.92;
            currencySymbol = "€";
        } else if ($('#gbp').is(':checked')) {
            ticketCostSubtract = 0.78;
            currencySymbol = "£";
        }

        $('.currency-symbol').text(currencySymbol);
        window.ticketCostSubtract = ticketCostSubtract;
                recalc();
    }

  
    window.ticketCostSubtract = 0.99; 
    $('input[name="currency"]').change(handleCurrencyChange);

    handleCurrencyChange();

    function moveElements() {
        var screenWidth = window.innerWidth;
        if (screenWidth <= 990) {
            $('#chats-num-div').append($('#chats-num'));
            $('#emails-num-div').append($('#emails-num'));
            $('#calls-num-div').append($('#calls-num'));
        }
    }
    moveElements();
    $(window).resize(function() {
        moveElements();
    });    


   $('.range-slider').on('input', function() {
        let inputFieldId = $(this).attr('id') + '-num';
        $('#' + inputFieldId).val($(this).val());
        applyFill(this);
    });

function performCalculation() {
    var ticketVolumeValue = $('#ticketVolume').val();
    if (ticketVolumeValue && parseFloat(ticketVolumeValue) >= 1) {
        $('#error-volume-msg').css('visibility', 'hidden');
        setTimeout(function() {
        $('.relative-top-50').css('height', 'auto');
 }, 200);

        $('#first-panel').css('opacity', 0);
        setTimeout(function() {
            $('#first-panel').css('visibility', 'hidden');
            $('#second-panel').css('visibility', 'visible').css('opacity', 1);
        }, 200);

        initializeDefaultSliderValues(parseFloat(ticketVolumeValue));
        recalc();
    } else {
        $('#error-volume-msg').css('visibility', 'visible');
        return false;
    }
}



$('#calculate').click(function() {
    performCalculation();
});

$('#ticketVolume').keydown(function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
			$('#calculate').click();
        performCalculation();
    }
});

    $('.input-slider-field').on('input', function() {
        let sliderId = $(this).attr('id').replace('-num', '');
        let rangeSlider = $('#' + sliderId);
        rangeSlider.val($(this).val());
        applyFill(rangeSlider.get(0));
        updateChartDataAndCheckError();
    });

    $('.range-slider').each(function() {
        applyFill(this);
    });

    function applyFill(slider) {
        const percentage = 100 * (slider.value - slider.min) / (slider.max - slider.min);
        let colorFill;
        if (slider.id === 'chats') {
            colorFill = `linear-gradient(90deg, #FF5C00 ${percentage}%, #e5e5e5 ${percentage}%)`;
        } else if (slider.id === 'emails') {
            colorFill = `linear-gradient(90deg, #333333 ${percentage}%, #e5e5e5 ${percentage}%)`;
        } else if (slider.id === 'calls') {
            colorFill = `linear-gradient(90deg, #86C7D6 ${percentage}%, #e5e5e5 ${percentage}%)`;
        }
        slider.style.background = colorFill;
    }


 function updateSlidersMax(ticketVolume) {
    $('.range-slider').attr('max', ticketVolume * 5);    

}

// Function to initialize default slider values
function initializeDefaultSliderValues(ticketVolume) {
    var chatValue = Math.round(ticketVolume * 0.3);
    var emailsValue = Math.round(ticketVolume * 0.6); 
    var callsValue = Math.round(ticketVolume * 0.1);

    $('#chats-num').val(chatValue);
    $('#emails-num').val(emailsValue);
    $('#calls-num').val(callsValue);

    // Update slider positions and visual representation
    var chatsSlider = $('#chats').val(chatValue).get(0);
    var emailsSlider = $('#emails').val(emailsValue).get(0);
    var callsSlider = $('#calls').val(callsValue).get(0);

    applyFill(chatsSlider);
    applyFill(emailsSlider);
    applyFill(callsSlider);
}

// Function to handle recalculations
function recalc() {
    var ticketVolume = parseFloat($('#ticketVolume').val()) || 0;
    updateSlidersMax(ticketVolume);
  var ticketVolume = parseFloat($('#ticketVolume').val()) || 0;
        updateSlidersMax(ticketVolume);


	$('.max').text(Math.round(ticketVolume * 5));

    var chatValue = parseFloat($('#chats-num').val()) || 0;
    var emailsValue = parseFloat($('#emails-num').val()) || 0;
    var callsValue = parseFloat($('#calls-num').val()) || 0;

    var userSpecifiedAgents = parseInt($('#agents').val());
    var calculatedAgents = (ticketVolume > 0) ? Math.max(1, Math.round(ticketVolume / 800)) : 0;
    var no_agents = (userSpecifiedAgents > 0) ? userSpecifiedAgents : calculatedAgents;
    no_agents = Math.max(1, no_agents);

    var salary_agents = parseFloat($('#salary_agents').val()) || 30000;
    var ticket_cost = (ticketVolume > 0) ? (salary_agents * no_agents / ticketVolume / 12) : 0;

    var chat = chatValue * 12;
    var emails = emailsValue * 12;
    var calls = callsValue * 12;

    var tickets_solved = Math.round(chat * 0.6 + emails * 0.2);
        var savings = Math.max(0, Math.round(tickets_solved * (ticket_cost - window.ticketCostSubtract)));
   
    $('#agents').attr('placeholder', calculatedAgents);
    $('#tickets_solved').text(tickets_solved.toLocaleString());
    $('#savings_delivered').text(savings.toLocaleString());
    $('#cost_per_ticket').text(ticket_cost.toFixed(2));
};

$('#ticketVolume').on('change', function() {
    var ticketVolume = parseFloat($(this).val()) || 0;
    initializeDefaultSliderValues(ticketVolume);
    recalc();
});

 $('#agents, #salary_agents').on('input change', function() {
        recalc();
    });
$('.range-slider, .input-slider-field').on('input change', function() {
    if($(this).hasClass('range-slider')) {
        let inputFieldId = $(this).attr('id') + '-num';
        $('#' + inputFieldId).val($(this).val());
    } else {
        let sliderId = $(this).attr('id').replace('-num', '');
        $('#' + sliderId).val($(this).val());
    }
    recalc();
});
    recalc();

$('#share').click(function() {
    var url = constructUrlWithParameters();
    navigator.clipboard.writeText(url).then(function() {
        alert("URL copied to clipboard!");
    }, function(err) {
        console.error('Try again', err);
    });
});
if (getParameterByName('ticketVolume') !== null) {
    var ticketVolume = parseFloat(getParameterByName('ticketVolume')) || 0;
    var chatsNum = parseInt(getParameterByName('chatsNum')) || 0;
    var emailsNum = parseInt(getParameterByName('emailsNum')) || 0;
    var callsNum = parseInt(getParameterByName('callsNum')) || 0;

    $('#ticketVolume').val(ticketVolume);
    $('#chats-num').val(chatsNum);
    $('#emails-num').val(emailsNum);
    $('#calls-num').val(callsNum);
    $('#agents').val(getParameterByName('agents'));
    $('#salary_agents').val(getParameterByName('salaryAgents'));

    updateSlidersMax(ticketVolume);

    $('#chats').val(chatsNum);
    $('#emails').val(emailsNum);
    $('#calls').val(callsNum);

    applyFill($('#chats').get(0));
    applyFill($('#emails').get(0));
    applyFill($('#calls').get(0));

    $('.relative-top-50').css('height', 'auto');
    $('#first-panel').css('visibility', 'hidden');
    $('#second-panel').css('visibility', 'visible').css('opacity', 1);
    
    recalc();
}
$('#email-report-button').click(function() {
    var ticketVolume = $('#ticketVolume').val() || '';
    var ticketsSolved = $('#tickets_solved').text() || '';
    var savingsDelivered = $('#savings_delivered').text() || '';
    var costPerTicket = $('#cost_per_ticket').text() || '';
    var chats = $('#chats-num').val() || '';
    var emails = $('#emails-num').val() || '';
    var calls = $('#calls-num').val() || '';
    var numberOfAgents = $('#agents').val() || $('#agents').attr('placeholder') || '';
    var agentsSalary = $('#salary_agents').val() || '';
var currency = getSelectedCurrency();


   $('input[name="calculator___monthly_ticket_volume"]').val(ticketVolume);
    $('input[name="calculator___tickets_solved_by_zowie"]').val(ticketsSolved);
    $('input[name="calculator___savings_delivered"]').val(savingsDelivered);
    $('input[name="calculator___cost_per_ticket"]').val(costPerTicket);
    $('input[name="calculator___chats__"]').val(chats);
    $('input[name="calculator___calls__"]').val(calls);
    $('input[name="calculator___emails__"]').val(emails);
    $('input[name="calculator___number_of_agents"]').val(numberOfAgents);
    $('input[name="calculator___agents_salary"]').val(agentsSalary);
 $('input[name="calculator___currency"]').val(currency);
});


});
