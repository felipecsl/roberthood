import System.Environment
import Data.List

avg :: [Int] -> Int
avg xs = div (sum xs) (length xs)

sma :: Int -> [Int] -> [Int]
sma period xs
    | period >= length xs = [avg xs]
    | otherwise = [avg (take period xs)] ++ sma period (tail xs)

main = do
   args <- getArgs
   let period = read (args !! 0) :: Int
   let arr = read (args !! 1) :: [Int]
   print (sma period arr)
