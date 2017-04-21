// example hook for Raspberry Pi GPIO
import { exec } from 'child_process'

export default {
  GPIO: (num, value) => {
    const n = int(num)
    if (n < 0 || n > 25) { return }
    exec(`x
      echo ${num} > /sys/class/gpio/export
      echo out > /sys/class/gpio/gpio${num}/direction
      echo ${value ? 1 : 0} > /sys/class/gpio/gpio${num}/value
      echo ${num} > /sys/class/gpio/unexport
    `)
  }
}
