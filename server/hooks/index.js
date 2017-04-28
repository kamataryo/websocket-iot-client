// example hook for Raspberry Pi GPIO
import { exec } from 'child_process'
import switz    from 'switz'

const gpio = {
  export    : num        => `echo ${num} > /sys/class/gpio/export`,
  direction : (dir, num) => `echo ${dir} > /sys/class/gpio/gpio${num}/direction`,
  toggle    : (val, num) => `echo ${val ? 1 : 0} > /sys/class/gpio/gpio${num}/value`,
  unexport  : num        => `echo ${num} > /sys/class/gpio/unexport`
}

export default {
  init: () => {
    exec(gpio.export(14))
    exec(gpio.export(15))
    exec(gpio.export(18))
    exec(gpio.direction('out', 14))
    exec(gpio.direction('out', 15))
    exec(gpio.direction('out', 18))
  },
  changeOn : (key, val) => () => {
    switz(key, s => {
      s.case('toggle0', () => exec(gpio.toggle(val, 14)))
      s.case('toggle1', () => exec(gpio.toggle(val, 15)))
      s.case('toggle2', () => exec(gpio.toggle(val, 18)))
    })
  },
  terminate: () => {
    exec(gpio.unexport(14))
    exec(gpio.unexport(15))
    exec(gpio.unexport(18))
  },
}
