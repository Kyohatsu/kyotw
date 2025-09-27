ScriptAPI.register('ConfirmEnhancer', true, 'Warre', 'nl.tribalwars@coma.innogames.de');

/* 
 * @name: ConfirmEnhancer
 * @author: Warre modded by Kyohatsu.
 * @description: Enhance the confirm page with send time calculation synced to server time
 */

function formatTimes(seconds) {
    function pad(num) {
        return num.toString().padStart(2, '0');
    }
    const date = new Date(seconds * 1000);
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

let serverDrift = 0;

function syncServerDrift() {
    const serverTimeText = $('#serverTime').text().trim();
    const serverDateText = $('#serverDate').text().trim();

    const [day, month, year] = serverDateText.split('/');
    const [hours, minutes, seconds] = serverTimeText.split(':');

    const serverTime = new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    const localTime = Date.now();

    serverDrift = serverTime - localTime;
}

function getPreciseServerTime() {
    return Date.now() + serverDrift;
}

function startLiveSendTimer(sendTime) {
    const $timerSpan = $('.sendTimer');
    const $progressFill = $('.sendProgressFill');
    const totalDuration = sendTime - (getPreciseServerTime() / 1000);

    function updateTimer() {
        const now = getPreciseServerTime() / 1000;
        const remaining = sendTime - now;

        if (remaining <= 0) {
            $timerSpan.text('00:00:00.000').css('color', 'red').css('visibility', 'visible');
            $progressFill.css({ width: '100%', background: 'red' });
            return;
        }

        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = Math.floor(remaining % 60);
        const milliseconds = Math.floor((remaining - Math.floor(remaining)) * 1000);

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
        $timerSpan.text(timeString);
        $timerSpan.css('visibility', 'visible'); // No blinking

        const progress = Math.min(1, 1 - (remaining / totalDuration));
        const percent = (progress * 100).toFixed(2) + '%';
        let color = 'green';
        if (progress > 0.66) color = 'red';
        else if (progress > 0.33) color = 'orange';

        $progressFill.css({ width: percent, background: color });

        requestAnimationFrame(updateTimer);
    }

    updateTimer();
}

if ((game_data.screen === 'map' || game_data.screen === 'place') && $('#place_confirm_units').length > 0 && $('.sendTime').length === 0) {
    const commandForm = $('form[action*="action=command"]');
    const commandTable = commandForm.find('table').first();

    $.get($('.village_anchor').first().find('a').first().attr('href'), function (html) {
        const $commandsContainer = $(html).find('.commands-container');

        if ($commandsContainer.length === 0) {
            UI.ErrorMessage('No commands found');
            return;
        }

        commandTable.css('float', 'left')
            .find('tr').last()
            .after('<tr><td>Send:</td><td class="sendTime">-</td>');

        const width = (game_data.screen === 'map') ? '100%' : ($('#content_value').width() - commandTable.width() - 10) + 'px';
        commandTable.closest('table')
            .after($commandsContainer.find('table').parent().html() + '<br><div style="clear:both;"></div>')
            .next().css({
                float: 'right',
                width: width,
                display: 'block',
                'max-height': commandTable.height(),
                overflow: 'scroll'
            });

        $('tr.command-row').on('click', function () {
            const $row = $(this);

            const durationCell = commandTable.find('td').filter(function () {
                return $(this).text().trim().match(/^(Duur:|Duration:|Travel time:)/i);
            }).next();

            const durationText = durationCell.text().trim();
            const durationParts = durationText.split(':');

            if (durationParts.length !== 3 || durationParts.some(p => isNaN(parseInt(p)))) {
                $('.sendTime').html('⛔ Duration format error');
                return;
            }

            const durationSeconds = (parseInt(durationParts[0]) * 3600) + (parseInt(durationParts[1]) * 60) + parseInt(durationParts[2]);
            const endTime = parseInt($row.find('span.timer').data('endtime'));

            if (isNaN(endTime)) {
                $('.sendTime').html('⛔ Invalid end time');
                return;
            }

            const localTimestamp = Math.floor(Date.now() / 1000);
            syncServerDrift();
            const serverTimestamp = getPreciseServerTime() / 1000;
            const sendTime = serverTimestamp + (endTime - localTimestamp) - durationSeconds;

            $row.closest('table').find('td').css('background-color', '');
            $row.find('td').css('background-color', '#FFF68F');

            $('.sendTime').html(`
                ${formatTimes(sendTime)} 
                (<span class="sendTimer"></span>)
                <div class="sendProgressBar" style="margin-top:5px; width:100%; height:6px; background:#ccc; border-radius:3px; overflow:hidden;">
                    <div class="sendProgressFill" style="height:100%; width:0%; background:green; transition:width 0.1s linear;"></div>
                </div>
            `);

            startLiveSendTimer(sendTime);
            document.title = formatTimes(sendTime);
        }).filter(function () {
            return $('img[src*="/return_"], img[src*="/back.png"]', this).length > 0;
        }).remove();

        $('.widget-command-timer').addClass('timer');
        Timing.tickHandlers.timers.initTimers('widget-command-timer');
    });
}
