package common

// Return a slice of ascending ints:
//
// startAt0 = true  -> [0..n]
//
// startAt0 = false -> [1..n]
func AscendingInts(n int, startAt0 bool) []int {
	if n < 0 {
		return []int{}
	}

	size := n
	offset := 1
	if startAt0 {
		size++
		offset = 0
	}

	arr := make([]int, size)

	for i := range n {
		arr[i] = i + offset
	}
	return arr
}
