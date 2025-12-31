#include <iostream> 
#include<vector>
using namespace std;
int knapSack(int W, vector<int>& wt, vector<int>& val) { 
    int n = 3;
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for(int i=0; i<n; i++){
        dp[i][0] = 0;
    }
    
    for (int i=1; i<=n; i++) {
        for (int w=1; w<=W; w++) { 
            if (wt[i-1]<=w) {
                dp[i][w]= max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]);
            } 
            else {
                dp[i][w] = dp[i-1][w];
            }
       }
    }
    return dp[n][W];
}
int main() { 
    vector<int> wt = {1, 3, 4};
    vector<int> val = {10, 15, 25}; 
    int W = 6; 

    cout<<endl<<"Maximum value achievable: "<<knapSack(W, wt, val)<<endl<<"\n";
    return 0;
}
