<template>
    <div class="no-access">
      <div class="content" data-aos="fade-down" data-aos-duration="1500">
        <h1>Oops!! No Access</h1>
        <p>It seems you've hit a roadblock.
        We are really sorry, but you do not have permission to access this page.</p>
        <button class="button" @click="$router.push({ name: 'Home' })">Go back to Homepage</button>
      </div>
    </div>
  </template>
  
  <script>
  </script>
  
  <style scoped>
    .no-access {
        height: 100vh;
        display: flex;
        background-image: linear-gradient(360deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, .2) 100%), url(/sjcet.webp);
        background-color: #000;
        background-position: center;
        background-size: cover;
        justify-content: center;
        align-items: center;
    }
    
    .content {
        background: rgba(235, 231, 231, 0.671);
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 100%;
    }
    
    .no-access h1 {
        font-size: 2.5rem;
        margin-bottom: 20px;
        color: #e51111;
        text-align: center;
    }
    
    .no-access p {
        font-size: 1.5em;
        margin-bottom: 30px;
    }
    
    .no-access .button {
        padding: 15px 30px;
        font-size: 1.2em;
        background-color: #18df43;
        color: rgb(3, 3, 3);
        border: 3px solid #141515;
        border-radius: 8px;
        cursor: pointer;
        transition: 0.3s, color 0.3s;
        display: inline-block;
        align-items: center;
        padding: 10px 30px;
    }
    
    .no-access .button:hover {
        background-color: #0c0c0c;
        color: #18df43;
        transition: 0.3s, color 0.3s;
        border: 3px solid #18df43;
    }
    @media (max-width: 991px) {
        .content {
            padding: 20px;
        }
    
        .no-access h1 {
            font-size: 2em;
        }
    
        .no-access p {
            font-size: 1em;
        }
    
        .no-access button {
            padding: 10px 20px;
            font-size: 1em;
        }
    }
</style>
  