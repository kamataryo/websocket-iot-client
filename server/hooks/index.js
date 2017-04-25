// example hook for Raspberry Pi GPIO
import { exec } from 'child_process'
import switz    from 'switz'

export default {
  init: () => {
    exec('echo 14 > /sys/class/gpio/export')
    exec('echo 15 > /sys/class/gpio/export')
    exec('echo 18 > /sys/class/gpio/export')
    exec('echo out > /sys/class/gpio/gpio14/direction')
    exec('echo out > /sys/class/gpio/gpio15/direction')
    exec('echo out > /sys/class/gpio/gpio18/direction')
  },
  changeOn : (key, value) => () => {
    switz(key, s => {
      s.case('toggle0', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio14/value`))
      s.case('toggle1', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio15/value`))
      s.case('toggle2', () => exec(`echo ${value ? 1 : 0} > /sys/class/gpio/gpio18/value`))
    })
  },
  terminate: () => {
    exec('echo 14 > /sys/class/gpio/unexport')
    exec('echo 15 > /sys/class/gpio/unexport')
    exec('echo 18 > /sys/class/gpio/unexport')
  },
}
