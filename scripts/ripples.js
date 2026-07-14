
        $(document).ready(function() {
            const baseRadius = 37;
            let time = 0;
            
            try {
                const $ripples = $('#background').ripples({
                    resolution: 512,
                    dropRadius: baseRadius,
                    perturbance: 0.12,
                    interactive: true
                });

                function handleRipple(e) {
                    const $el = $(this);
                    const x = e.pageX - $el.offset().left;
                    const y = e.pageY - $el.offset().top;
                    
                    time += 0.05;
                    const currentRadius = baseRadius * 0.5 + Math.sin(time * 4) * 10;
                    const strength = e.type === 'mousedown' ? 0.7 : 0.3;
                    
                    $el.ripples('drop', x, y, currentRadius, strength);
                }

                $('#background')
                    .on('mousemove', handleRipple)
                    .on('mousedown', handleRipple);

            } catch (error) {
                console.error('Error:', error);
                if (error.message?.includes('WebGL')) {
                    console.error('WebGL not supported or encountered an error');
                }
            }
        });
    