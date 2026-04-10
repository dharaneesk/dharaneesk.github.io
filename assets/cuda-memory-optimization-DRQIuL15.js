import{j as e}from"./index-CD8M97Ae.js";function r(s){const n={code:"code",em:"em",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:`Writing custom CUDA kernels? Here's why your "optimized" C++ code might actually be bottlenecked by memory latency, and how to fix it. Let's talk about memory coalescence and shared memory banks. 👇`}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{children:"1. The Problem: Naive Matrix Multiplication"}),`
`,e.jsxs(n.p,{children:["When transitioning from PyTorch's highly optimized ",e.jsx(n.code,{children:"torch.matmul"})," to writing custom CUDA kernels, the first attempt is often a naive implementation. You spin up threads, map them to matrix indices, and calculate the dot product."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-cpp",children:`__global__ void naiveMatmul(float* A, float* B, float* C, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    
    if(row < N && col < N) {
        float sum = 0.0f;
        for(int i = 0; i < N; i++) {
            sum += A[row * N + i] * B[i * N + col];
        }
        C[row * N + col] = sum;
    }
}
`})}),`
`,e.jsxs(n.p,{children:["It looks correct. It produces the exact same output as PyTorch. But when you profile it using ",e.jsx(n.code,{children:"nsight compute"}),", you realize it's significantly slower. Why?"]}),`
`,e.jsxs(n.p,{children:["The answer lies in ",e.jsx(n.strong,{children:"Memory Bound Operations"}),". The GPU's compute cores are starving for data."]}),`
`,e.jsx(n.h2,{children:"2. Deep Technical Explanation: The Memory Hierarchy"}),`
`,e.jsx(n.p,{children:"To understand the bottleneck, we have to look at how data travels from Global Memory (VRAM) to the Streaming Multiprocessors (SMs)."}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Global Memory Latency:"})," Accessing VRAM takes ~400-800 clock cycles."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Cache Lines:"})," When a thread requests a float (4 bytes) from Global Memory, the GPU doesn't fetch just 4 bytes. It fetches a 32-byte or 128-byte cache line."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Memory Coalescing:"}),' If 32 threads in a warp access contiguous memory addresses, the hardware "coalesces" these into a single memory transaction.']}),`
`]}),`
`,e.jsxs(n.p,{children:["In our naive kernel, threads in a warp (consecutive ",e.jsx(n.code,{children:"col"})," values) are accessing contiguous elements of matrix ",e.jsx(n.code,{children:"B"}),". This is coalesced! Perfect."]}),`
`,e.jsxs(n.p,{children:["However, each thread also needs to read from matrix ",e.jsx(n.code,{children:"A"}),". Since threads in a warp share the same ",e.jsx(n.code,{children:"row"}),", they all need the ",e.jsx(n.em,{children:"exact same element"})," ",e.jsx(n.code,{children:"A[row * N + i]"})," at the same time. While this broadcasts effectively, as ",e.jsx(n.code,{children:"i"})," increments, we are reading across the row. The far larger issue is matrix ",e.jsx(n.code,{children:"B"})," scaling for large N; we hit global memory endlessly for the same values across different blocks."]}),`
`,e.jsx(n.h3,{children:"The Solution: Shared Memory Tiling"}),`
`,e.jsx(n.p,{children:"We need to bring data closer to the compute cores. Shared Memory (SRAM) sits right next to the SMs and takes only ~20-30 clock cycles to access."}),`
`,e.jsxs(n.p,{children:['By dividing the matrices into "tiles," we can load a block of data into Shared Memory ',e.jsx(n.em,{children:"once"}),", and then have all threads in the threadblock compute on that data from SRAM."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-cpp",children:`#define TILE_SIZE 32

__global__ void tiledMatmul(float* A, float* B, float* C, int N) {
    __shared__ float sA[TILE_SIZE][TILE_SIZE];
    __shared__ float sB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    
    float sum = 0.0f;
    
    for(int tile = 0; tile < (N + TILE_SIZE - 1) / TILE_SIZE; tile++) {
        // Coalesced load into shared memory
        if (row < N && (tile * TILE_SIZE + threadIdx.x) < N) {
            sA[threadIdx.y][threadIdx.x] = A[row * N + tile * TILE_SIZE + threadIdx.x];
        } else {
            sA[threadIdx.y][threadIdx.x] = 0.0;
        }
            
        if (col < N && (tile * TILE_SIZE + threadIdx.y) < N) {
            sB[threadIdx.y][threadIdx.x] = B[(tile * TILE_SIZE + threadIdx.y) * N + col];
        } else {
            sB[threadIdx.y][threadIdx.x] = 0.0;
        }

        __syncthreads(); // Wait for all threads to finish loading

        // Compute using fast shared memory
        for(int k = 0; k < TILE_SIZE; k++) {
            sum += sA[threadIdx.y][k] * sB[k][threadIdx.x];
        }

        __syncthreads(); // Wait before writing the next tile
    }
    
    if (row < N && col < N) {
        C[row * N + col] = sum;
    }
}
`})}),`
`,e.jsx(n.h2,{children:"3. Trade-offs and Decisions"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Tile Size Selection:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"A larger tile size (e.g., 32x32) means more reuse of data in shared memory, lowering Global Memory bandwidth requirements."}),`
`,e.jsx(n.li,{children:"However, larger tiles consume more Shared Memory per block. If a block uses too much shared memory, fewer blocks can be scheduled on a single SM simultaneously, lowering occupancy. I found 32x32 to be the sweet spot for modern architectures (Ampere/Hopper)."}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Bank Conflicts:"}),`
Shared memory is divided into 32 "banks." If multiple threads access different addresses that map to the `,e.jsx(n.em,{children:"same"})," bank simultaneously, the requests are serialized (a bank conflict). In our simple tiled approach, accessing ",e.jsx(n.code,{children:"sB[k][threadIdx.x]"})," doesn't cause conflicts because consecutive threads access consecutive banks. Accessing ",e.jsx(n.code,{children:"sA[threadIdx.y][k]"})," broadcasts exactly the same value to all threads, which is heavily optimized by hardware."]}),`
`,e.jsx(n.h2,{children:"4. Real-world Impact"}),`
`,e.jsx(n.p,{children:"Testing this on an A10G with matrix dimensions 4096 x 4096:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Naive Kernel:"})," ~45 ms per multiplication."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tiled Kernel:"})," ~8 ms per multiplication."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Improvement:"})," 5.6x faster by simply managing memory operations efficiently!"]}),`
`]}),`
`,e.jsx(n.p,{children:"While still not beating specialized cuBLAS kernels (which use tensor cores and assembly-level optimizations), this demonstrates how crucial memory locality is for AI inference."}),`
`,e.jsx(n.h2,{children:"5. Key Takeaways"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Compute is Cheap, Memory is Expensive:"})," Most AI workloads today are memory-bound, not compute-bound. Moving data takes an order of magnitude more time."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Coalescence is King:"})," Always ensure threads in a warp access contiguous blocks of global memory."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Leverage Shared Memory:"})," Reusing data? Bring it into SRAM via tiling."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Profile Often:"})," ",e.jsx(n.code,{children:"ncu"})," (Nsight Compute) is your best friend when writing custom triton or CUDA kernels to verify if your assumptions about memory access patterns are true."]}),`
`]})]})}function i(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{i as default};
