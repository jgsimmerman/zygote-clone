import stepState from '../state/step'
import steps from './steps'
import changeStep from './change-step'

export default function nextStep(){
	let i = 0, step
	do {
		i++
		const index = steps.indexOf(stepState.state.step) + i
		step = steps[index]
	} while (stepState.state.skip[step] && i < steps.length)

	if (step) {
		// console.log(`Moving to step ${step}`)
		changeStep(step)
	}
}