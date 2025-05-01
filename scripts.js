const synth = new Tone.Synth().toDestination();
        function playEatSound() {
            synth.triggerAttackRelease("C6", "8n");
        }
        function playGameOverSound() {
           
            const polySynth = new Tone.PolySynth().toDestination();
            polySynth.triggerAttackRelease(["C2", "E2", "G2", "Bb2"], "2n");
        }
        function playMoveSound() {
           
            const membraneSynth = new Tone.MembraneSynth().toDestination();
            membraneSynth.triggerAttackRelease("A4", "16n");
        }