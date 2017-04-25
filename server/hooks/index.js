// example hook for Raspberry Pi GPIO
import { exec } from 'child_process'
import switz    from 'switz'

export default {
  init: () => {
    exec('echo 23 > /sys/class/gpio/export')
    exec('echo 24 > /sys/class/gpio/export')
    exec('echo 25 > /sys/class/gpio/export')
    exec('echo out > /sys/class/gpio/gpio23/direction')
    exec('echo out > /sys/class/gpio/gpio24/direction')
    exec('echo out > /sys/class/gpio/gpio25/direction')
  },
  changeOn : (key, value) => () => {
    switz(key, s => {
      s.case('toggle0', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio23/value`))
      s.case('toggle1', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio24/value`))
      s.case('toggle2', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio25/value`))
    })
  },
  terminate: () => {
    exec('echo 23 > /sys/class/gpio/unexport')
    exec('echo 24 > /sys/class/gpio/unexport')
    exec('echo 25 > /sys/class/gpio/unexport')
  },
}
